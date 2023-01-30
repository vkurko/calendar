<script>
    import {getContext} from 'svelte';
    import {is_function, listen, run_all} from 'svelte/internal';
    import {
        addDay, addDuration, ancestor, assign, cloneDate, cloneEvent, createDuration, rect,
        toEventWithLocalDates, toISOString, toViewWithLocalDates
    } from '@event-calendar/common';
    import {traverseTimeGrid, animate, traverseResourceTimeGrid, traverseDayGrid, limit, floor} from './utils';

    let {_iEvents, _iClass, _ignoreClick, _events, _viewDates, _view, datesAboveResources, dragScroll, editable,
        eventStartEditable, eventDragMinDistance, eventDragStart, eventDragStop, eventDrop, eventLongPressDelay,
        eventResizeStart, eventResizeStop, eventResize, longPressDelay, select, selectBackgroundColor,
        selectLongPressDelay, selectMinDistance, slotDuration, slotHeight, hiddenDays, unselect: unselectFn,
        unselectAuto, unselectCancel} = getContext('state');

    const ACTION_DRAG = 1;
    const ACTION_RESIZE = 2;
    const ACTION_SELECT = 3;
    const VIEW_TIME_GRID = 1;
    const VIEW_DAY_GRID = 2;
    let action;
    let view;
    let interacting;
    let event;
    let col, row;
    let offsetX, offsetY;
    let fromX, fromY;
    let toX, toY;
    let delta;
    let colEl, rowEls, bodyEl;
    let colRect, bodyRect;
    let _viewResources;
    let resourceCol, newResourceCol;
    let isAllDay = false;
    let iClass;
    let minEnd;  // minimum end time when resizing
    let selected;  // whether selection has been made
    let timer;  // timer for long press delays

    export function dragTimeGrid(eventToDrag, el, jsEvent, resourcesStore, allDay, resize) {
        if (!action && jsEvent.isPrimary) {
            action = resize ? ACTION_RESIZE : ACTION_DRAG;
            view = VIEW_TIME_GRID;
            event = eventToDrag;
            _viewResources = resourcesStore;
            isAllDay = allDay;
            iClass = resize ? (allDay ? 'resizingX' : 'resizingY') : 'dragging';

            let dayEl = ancestor(el, 2);
            if (resourcesStore) {
                [colEl, bodyEl, col, resourceCol] = traverseResourceTimeGrid(dayEl, $datesAboveResources);
            } else {
                [colEl, bodyEl, col] = traverseTimeGrid(dayEl);
            }

            common(jsEvent);

            offsetY = floor((jsEvent.clientY - colRect.top) / $slotHeight);
            offsetX = 0;  // applicable for all-day slot
            if (allDay && (!resourcesStore || !$datesAboveResources)) {
                offsetX = floor((jsEvent.clientX - colRect.left) / colRect.width) - col - (resourceCol || 0) * $_viewDates.length;
            }

            if (resize) {
                minEnd = addDuration(cloneDate(event.start), $slotDuration);
            }

            move(jsEvent);
        }
    }

    export function dragDayGrid(eventToDrag, el, jsEvent, inPopup, resize) {
        if (!action && jsEvent.isPrimary) {
            action = resize ? ACTION_RESIZE : ACTION_DRAG;
            view = VIEW_DAY_GRID;
            event = eventToDrag;
            iClass = resize ? 'resizingX' : 'dragging';

            let dayEl = ancestor(el, inPopup ? 3 : 2);
            [colEl, bodyEl, col, row, rowEls] = traverseDayGrid(dayEl);

            common(jsEvent);

            offsetX = inPopup ? 0 : floor((jsEvent.clientX - colRect.left) / colRect.width) - col;

            if (resize) {
                minEnd = cloneDate(event.start);
                minEnd.setUTCHours(event.end.getUTCHours(), event.end.getUTCMinutes(), event.end.getUTCSeconds());
                if (minEnd < event.start) {
                    addDay(minEnd);
                    // minEnd = addDuration(cloneDate(event.start), $slotDuration);  alternative version
                }
            }

            move(jsEvent);
        }
    }

    export function selectTimeGrid(colDate, dayEl, jsEvent, resourcesStore, _slotTimeLimits, allDay) {
        if (!action && jsEvent.isPrimary) {
            action = ACTION_SELECT;
            view = VIEW_TIME_GRID;
            _viewResources = resourcesStore;
            isAllDay = allDay;
            iClass = 'selecting';

            if (resourcesStore) {
                [colEl, bodyEl, col, resourceCol] = traverseResourceTimeGrid(dayEl, $datesAboveResources);
            } else {
                [colEl, bodyEl, col] = traverseTimeGrid(dayEl);
            }

            common(jsEvent);

            offsetY = floor((jsEvent.clientY - colRect.top) / $slotHeight);
            offsetX = 0;  // applicable for all-day slot
            if (allDay && (!resourcesStore || !$datesAboveResources)) {
                offsetX = floor((jsEvent.clientX - colRect.left) / colRect.width) - col - (resourceCol || 0) * $_viewDates.length;
            }

            // Create dummy source event
            let date = cloneDate(colDate);
            if (!allDay) {
                addDuration(
                    date,
                    $slotDuration,
                    offsetY + _slotTimeLimits.min.seconds / $slotDuration.seconds
                );
            }
            event = {
                allDay,
                start: date,
                end: allDay ? addDay(cloneDate(date)) : addDuration(cloneDate(date), $slotDuration),
                resourceIds: _viewResources ? [$_viewResources[resourceCol].id] : []
            };

            move(jsEvent);
        }
    }

    export function selectDayGrid(dayDate, dayEl, jsEvent) {
        if (!action && jsEvent.isPrimary) {
            action = ACTION_SELECT;
            view = VIEW_DAY_GRID;
            iClass = 'selecting';

            [colEl, bodyEl, col, row, rowEls] = traverseDayGrid(dayEl);

            common(jsEvent);

            offsetX = floor((jsEvent.clientX - colRect.left) / colRect.width) - col;

            // Create dummy source event
            let date = cloneDate(dayDate);
            event = {
                allDay: false,
                start: date,
                end: addDay(cloneDate(date)),
                resourceIds: []
            };

            move(jsEvent);
        }
    }

	function common(jsEvent) {
        window.getSelection().removeAllRanges();

        colRect = rect(colEl);
        bodyRect = rect(bodyEl);

        fromX = toX = jsEvent.clientX;
        fromY = toY = jsEvent.clientY;

        if (jsEvent.pointerType !== 'mouse') {
            // For touch devices init long press delay
            timer = setTimeout(() => {
                if (action) {
                    interacting = true;
                    move(jsEvent);
                }
            }, (selecting() ? $selectLongPressDelay : $eventLongPressDelay) ?? $longPressDelay);
        }
    }

    function move(jsEvent) {
        let rx = toX - colRect.left;
        let ry = toY - colRect.top;

        if (
            interacting ||
            jsEvent && jsEvent.pointerType === 'mouse' && distance() >= (selecting() ? $selectMinDistance : $eventDragMinDistance)
        ) {
            interacting = true;
            unselect(jsEvent);
            $_iClass = iClass;
            $_ignoreClick = true;

            let newCol = floor(rx / colRect.width);

            if (view === VIEW_TIME_GRID) {
                // timeGrid
                if (_viewResources) {
                    if (dragging()) {
                        if ($datesAboveResources) {
                            let dayCol = limit(floor(newCol / $_viewResources.length), $_viewDates.length - 1);
                            newResourceCol = limit(newCol - dayCol * $_viewResources.length, $_viewResources.length - 1);
                            newCol = dayCol;
                        } else {
                            newResourceCol = limit(floor(newCol / $_viewDates.length), $_viewResources.length - 1);
                            newCol -= newResourceCol * $_viewDates.length;
                        }
                    } else {
                        if ($datesAboveResources) {
                            newCol = floor(newCol / $_viewResources.length);
                        } else {
                            newCol -= resourceCol * $_viewDates.length;
                        }
                    }
                }

                newCol = limit(newCol, $_viewDates.length - 1);

                delta = createDuration({
                    days: ($_viewDates[newCol] - $_viewDates[col]) / 1000 / 60 / 60 / 24 - offsetX,
                    seconds: isAllDay ? 0 : (floor(ry / $slotHeight) - offsetY) * $slotDuration.seconds
                });
            } else {
                // dayGrid
                let cols = 7 - $hiddenDays.length;
                newCol = limit(newCol, cols - 1);
                let newRow = -1;
                do {
                    ++newRow;
                    ry -= rowEls[newRow].offsetHeight;
                } while (ry > 0 && newRow < rowEls.length - 1);

                delta = createDuration({
                    days: ($_viewDates[newRow * cols + newCol] - $_viewDates[row * cols + col]) / 1000 / 60 / 60 / 24 - offsetX,
                });
            }

            if (!$_iEvents[0]) {
                if (selecting()) {
                    createIEventSelect();
                } else {
                    createIEvent(jsEvent, resizing() ? $eventResizeStart : $eventDragStart);
                }
            }
            $_iEvents[0].end = addDuration(cloneDate(event.end), delta);
            if (resizing()) {
                if ($_iEvents[0].end < minEnd) {
                    $_iEvents[0].end = minEnd;
                    delta = createDuration(($_iEvents[0].end - event.end) / 1000);
                }
            } else if (selecting()) {
                if ($_iEvents[0].end < event.end) {
                    $_iEvents[0].end = event.end;
                    $_iEvents[0].start = addDuration(cloneDate(event.start), delta);
                } else {
                    $_iEvents[0].start = event.start;
                }
            } else {
                $_iEvents[0].start = addDuration(cloneDate(event.start), delta);
                if (_viewResources) {
                    $_iEvents[0].resourceIds = event.resourceIds.filter(id => id !== $_viewResources[resourceCol].id);
                    $_iEvents[0].resourceIds.push($_viewResources[newResourceCol].id);
                }
            }
        }

        if ($dragScroll) {
            animate(() => {
                if (toY < 0) {
                    window.scrollBy(0, Math.max(-10, toY / 3));
                }
                if (toY < bodyRect.top) {
                    bodyEl.scrollTop += Math.max(-10, (toY - bodyRect.top) / 3);
                }
                if (toY > window.innerHeight) {
                    window.scrollBy(0, Math.min(10, (toY - window.innerHeight) / 3));
                }
                if (toY > bodyRect.bottom) {
                    bodyEl.scrollTop += Math.min(10, (toY - bodyRect.bottom) / 3);
                }
            });
        }
    }

    export function handleScroll() {
        if (action) {
            colRect = rect(colEl);
            bodyRect = rect(bodyEl);
            move();
        }
    }

    function handlePointerMove(jsEvent) {
        if (action && jsEvent.isPrimary) {
            toX = jsEvent.clientX;
            toY = jsEvent.clientY;
            move(jsEvent);
        }
    }

    function handlePointerUp(jsEvent) {
        if (action && jsEvent.isPrimary) {
            if (interacting) {
                if (selecting()) {
                    if (is_function($select)) {
                        let {start, end} = toEventWithLocalDates($_iEvents[0]);
                        $select({
                            start,
                            end,
                            startStr: toISOString($_iEvents[0].start),
                            endStr: toISOString($_iEvents[0].end),
                            allDay: isAllDay,
                            jsEvent,
                            view: toViewWithLocalDates($_view),
                            resource: resourceCol !== undefined ? $_viewResources[resourceCol] : undefined
                        });
                    }
                    setTimeout(() => selected = true, 5 /*add some delay for touch devices*/);
                } else {
                    event.display = 'auto';

                    let callback = resizing() ? $eventResizeStop : $eventDragStop;
                    if (is_function(callback)) {
                        callback({event: toEventWithLocalDates(event), jsEvent, view: toViewWithLocalDates($_view)});
                    }

                    let oldEvent = cloneEvent(event);
                    updateEvent(event, $_iEvents[0]);

                    destroyIEvent();

                    callback = resizing() ? $eventResize : $eventDrop;
                    if (is_function(callback)) {
                        let eventRef = event;
                        let info = resizing() ? {endDelta: delta} : {
                            delta,
                            oldResource: resourceCol !== newResourceCol ? $_viewResources[resourceCol] : undefined,
                            newResource: resourceCol !== newResourceCol ? $_viewResources[newResourceCol] : undefined,
                        };
                        callback(assign(info, {
                            event: toEventWithLocalDates(event),
                            oldEvent: toEventWithLocalDates(oldEvent),
                            jsEvent,
                            view: toViewWithLocalDates($_view),
                            revert() {
                                updateEvent(eventRef, oldEvent);
                            }
                        }));
                    }
                }
            }

            colEl = rowEls = bodyEl = null;
            resourceCol = newResourceCol = undefined;
            action = view = interacting = false;
            isAllDay = false;
            $_iClass = undefined;
            _viewResources = undefined;

            if (timer) {
                clearTimeout(timer);
                timer = undefined;
            }
        }
    }

    function createIEvent(jsEvent, callback) {
        if (is_function(callback)) {
            callback({event: toEventWithLocalDates(event), jsEvent, view: toViewWithLocalDates($_view)});
        }
        event.display = 'preview';
        $_iEvents[0] = cloneEvent(event);
        event.display = 'ghost';
        $_events = $_events;
    }

    function createIEventSelect() {
        $_iEvents[0] = {
            id: '{select}',
            allDay: event.allDay,
            start: event.start,
            title: '',
            display: 'preview',
            extendedProps: {},
            backgroundColor: $selectBackgroundColor,
            resourceIds: event.resourceIds
        };
    }

    function destroyIEvent() {
        $_iEvents[0] = null;
    }

    function updateEvent(target, source) {
        target.start = source.start;
        target.end = source.end;
        target.resourceIds = source.resourceIds;
        $_events = $_events;
    }

    function distance() {
        return Math.sqrt(Math.pow(toX - fromX, 2) + Math.pow(toY - fromY, 2));
    }

    function dragging() {
        return action === ACTION_DRAG;
    }

    function resizing() {
        return action === ACTION_RESIZE;
    }

    function selecting() {
        return action === ACTION_SELECT;
    }

    export function unselect(jsEvent) {
        if (selected) {
            selected = false;
            destroyIEvent();
            if (is_function($unselectFn)) {
                $unselectFn({
                    jsEvent,
                    view: toViewWithLocalDates($_view)
                });
            }
        }
    }

    // Clear selection on view params change
    _view.subscribe(unselect);

    function handleClick(jsEvent) {
        if (selected && !($unselectCancel && jsEvent.target.closest($unselectCancel))) {
            unselect();
        }
    }

    function handleTouchStart(jsEvent) {
        if (action) {
            let target = jsEvent.target;
            let stops = [];
            let stop = () => run_all(stops);
            stops.push(listen(target, 'touchmove', createPreventDefaultHandler(() => interacting)));
            stops.push(listen(target, 'touchend', stop));
            stops.push(listen(target, 'touchcancel', stop));
        }
    }

    function createPreventDefaultHandler(condition) {
        return jsEvent => {
            if (condition()) {
                jsEvent.preventDefault();
            }
        };
    }
</script>

<svelte:window
    on:pointermove={handlePointerMove}
    on:pointerup={handlePointerUp}
    on:pointercancel={handlePointerUp}
    on:scroll={handleScroll}
    on:click={$unselectAuto ? handleClick : undefined}
    on:selectstart={createPreventDefaultHandler(() => action)}
    on:contextmenu={createPreventDefaultHandler(() => timer)}
    on:touchstart={handleTouchStart}
    on:touchmove|nonpassive
/>
