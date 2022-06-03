<script>
    import {getContext} from 'svelte';
    import {is_function} from 'svelte/internal';
    import {
        addDay, addDuration, assign, cloneDate, cloneEvent, createDuration, rect,
        toEventWithLocalDates, toViewWithLocalDates
    } from '@event-calendar/common';
    import {traverseTimeGrid, animate, traverseResourceTimeGrid, traverseDayGrid, limit, floor} from './utils';

    let {_iEvents, _iClass, _events, _viewDates, editable, eventStartEditable, eventDragMinDistance, eventDragStart,
        eventDragStop, eventDrop, eventResizeStart, eventResizeStop, eventResize, dragScroll, slotDuration, slotHeight,
        hiddenDays, _view, datesAboveResources} = getContext('state');

    const INTERACTING_TIME_GRID = 1;
    const INTERACTING_DAY_GRID = 2;
    let interacting = false;
    let resizing;  // whether it is just resizing
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
    let isAllDay;
    let minEnd;  // minimum end time when resizing

    export function startTimeGrid(event, el, jsEvent, resourcesStore, allDay, resize) {
        if (!interacting && jsEvent.isPrimary) {
            if (resourcesStore) {
                [colEl, bodyEl, col, resourceCol] = traverseResourceTimeGrid(el, $datesAboveResources);
            } else {
                [colEl, bodyEl, col] = traverseTimeGrid(el);
            }

            start(event, jsEvent);

            offsetY = floor((jsEvent.clientY - colRect.top) / $slotHeight);
            offsetX = 0;  // applicable for all-day slot
            if (allDay && (!resourcesStore || !$datesAboveResources)) {
                offsetX = floor((jsEvent.clientX - colRect.left) / colRect.width) - col - (resourceCol || 0) * $_viewDates.length;
            }

            _viewResources = resourcesStore;

            interacting = INTERACTING_TIME_GRID;
            isAllDay = allDay;
            resizing = resize;
            if (resizing) {
                minEnd = addDuration(cloneDate(event.start), $slotDuration);
                $_iClass = 'resizingY';
            }
        }
    }

    export function startDayGrid(event, el, jsEvent, inPopup, resize) {
        if (!interacting && jsEvent.isPrimary) {
            [colEl, bodyEl, col, row, rowEls] = traverseDayGrid(el, inPopup);

            start(event, jsEvent);

            offsetX = inPopup ? 0 : floor((jsEvent.clientX - colRect.left) / colRect.width) - col;

            _viewResources = undefined;

            interacting = INTERACTING_DAY_GRID;
            isAllDay = false;
            resizing = resize;
            if (resizing) {
                minEnd = cloneDate(event.start);
                minEnd.setUTCHours(event.end.getUTCHours(), event.end.getUTCMinutes(), event.end.getUTCSeconds());
                if (minEnd < event.start) {
                    addDay(minEnd);
                    // minEnd = addDuration(cloneDate(event.start), $slotDuration);  alternative version
                }
                $_iClass = 'resizingX';
            }
        }
    }

	function start(eventToDrag, jsEvent) {
        window.getSelection().removeAllRanges();

        event = eventToDrag;

        colRect = rect(colEl);
        bodyRect = rect(bodyEl);

        fromX = toX = jsEvent.clientX;
        fromY = toY = jsEvent.clientY;

        $_iClass = 'dragging';
    }

    function move(jsEvent) {
        let rx = toX - colRect.left;
        let ry = toY - colRect.top;

        let newCol = floor(rx / colRect.width);

        if (interacting === INTERACTING_TIME_GRID) {
            // timeGrid
            if (_viewResources) {
                if ($datesAboveResources) {
                    let dayCol = limit(floor(newCol / $_viewResources.length), $_viewDates.length - 1);
                    newResourceCol = limit(newCol - dayCol * $_viewResources.length, $_viewResources.length - 1);
                    newCol = dayCol;
                } else {
                    if (resizing) {
                        newCol -= resourceCol * $_viewDates.length;
                    } else {
                        newResourceCol = limit(floor(newCol / $_viewDates.length), $_viewResources.length - 1);
                        newCol -= newResourceCol * $_viewDates.length;
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

        if ($_iEvents[0] || resizing || distance() >= $eventDragMinDistance) {
            if (!$_iEvents[0]) {
                createIEvent(jsEvent, resizing ? $eventResizeStart : $eventDragStart);
            }
            $_iEvents[0].end = addDuration(cloneDate(event.end), delta);
            if (resizing) {
                if ($_iEvents[0].end < minEnd) {
                    $_iEvents[0].end = minEnd;
                    delta = createDuration(($_iEvents[0].end - event.end) / 1000);
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
        if (interacting) {
            colRect = rect(colEl);
            bodyRect = rect(bodyEl);
            move();
        }
    }

    function handlePointerMove(jsEvent) {
        if (interacting && jsEvent.isPrimary) {
            toX = jsEvent.clientX;
            toY = jsEvent.clientY;
            move(jsEvent);
        }
    }

    function handlePointerUp(jsEvent) {
        if (interacting && jsEvent.isPrimary) {
            if ($_iEvents[0]) {
                event.display = 'auto';

                let callback = resizing ? $eventResizeStop : $eventDragStop;
                if (is_function(callback)) {
                    callback({event: toEventWithLocalDates(event), jsEvent, view: toViewWithLocalDates($_view)});
                }

                let oldEvent = cloneEvent(event);
                updateEvent(event, $_iEvents[0]);
                $_iEvents[0] = null;

                callback = resizing ? $eventResize : $eventDrop;
                if (is_function(callback)) {
                    let eventRef = event;
                    let info = resizing ? {endDelta: delta} : {
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
            colEl = rowEls = bodyEl = null;
            resourceCol = newResourceCol = undefined;
            interacting = false;
            $_iClass = undefined;
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

    function updateEvent(target, source) {
        target.start = source.start;
        target.end = source.end;
        target.resourceIds = source.resourceIds;
        $_events = $_events;
    }

    function distance() {
        return Math.sqrt(Math.pow(toX - fromX, 2) + Math.pow(toY - fromY, 2));
    }

    function handleSelectStart(jsEvent) {
        if (interacting) {
            jsEvent.preventDefault();
        }
    }
</script>

<svelte:window
    on:pointermove={handlePointerMove}
    on:pointerup={handlePointerUp}
    on:selectstart={handleSelectStart}
    on:scroll={handleScroll}
/>
