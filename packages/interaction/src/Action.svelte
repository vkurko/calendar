<script>
    import {getContext} from 'svelte';
    import {
        addDay, addDuration, ancestor, assign, cloneDate, cloneEvent, copyTime, createDuration, getElementWithPayload,
        getPayload, isFunction, listen, listView, max, min, rect, runAll, subtractDay, subtractDuration, timelineView,
        toEventWithLocalDates, toISOString, toLocalDate, toViewWithLocalDates
    } from '@event-calendar/core';
    import {animate, limit} from './utils';

    let {_iEvents, _iClass, _events, _view, _dayGrid, _draggable, _bodyEl, datesAboveResources, dateClick, dragConstraint,
        dragScroll, eventDragMinDistance, eventDragStart, eventDragStop, eventDrop, eventLongPressDelay, eventResizeStart,
        eventResizeStop, eventResize, longPressDelay, resizeConstraint, selectable, select: selectFn, selectBackgroundColor,
        selectConstraint, selectLongPressDelay, selectMinDistance, slotDuration, slotHeight, slotWidth, unselect: unselectFn,
        unselectAuto, unselectCancel, validRange, view} = getContext('state');

    const ACTION_DRAG = 1;
    const ACTION_RESIZE_END = 2;
    const ACTION_RESIZE_START = 3;
    const ACTION_SELECT = 4;
    const ACTION_CLICK = 5;
    const ACTION_NO_ACTION = 6;
    let action;
    let interacting;
    let event;
    let display;
    let date, newDate;
    let resource, newResource;
    let fromX, fromY;
    let toX, toY;
    let bodyEl, bodyRect, clipEl, clipRect;
    let delta;
    let allDay;
    let iClass;
    let minResize;  // minimum end time when resizing
    let selectStep;  // minimum selection step
    let selected;  // whether selection has been made
    let noDateClick;  // do not perform date click
    let timer;  // timer for long press delays
    let viewport;
    let margin;
    let extraDuration;  // extra duration for zero duration events

    export function drag(eventToDrag, jsEvent, resize, forceDate, forceMargin, zeroDuration) {
        if (!action) {
            action = validJsEvent(jsEvent) ? (
                resize
                    ? (resize[1] == 'start' ? ACTION_RESIZE_START : ACTION_RESIZE_END)
                    : ($_draggable(eventToDrag) ? ACTION_DRAG : ACTION_NO_ACTION)
            ) : ACTION_NO_ACTION;

            if (complexAction()) {
                event = eventToDrag;

                common(jsEvent);

                if (forceDate) {
                    // Force date in popup
                    date = forceDate;
                }

                if (forceMargin) {
                    margin = forceMargin;
                }

                iClass = resize ? (resize[0] == 'x' ? 'resizingX' : 'resizingY') : 'dragging';

                if (resize) {
                    // Calculate the limits for resize
                    if (resizingStart()) {
                        minResize = cloneDate(event.end);
                        if (allDay) {
                            copyTime(minResize, event.start);
                            if (minResize >= event.end) {
                                subtractDay(minResize);
                            }
                        } else {
                            subtractDuration(minResize, $slotDuration);
                            if (minResize < event.start) {
                                minResize = event.start;
                            }
                            // Overwrite the date due to possible discrepancy between calculated date
                            // and resizer coordinates in browser
                            date = event.start;
                        }
                    } else {
                        minResize = cloneDate(event.start);
                        if (allDay) {
                            copyTime(minResize, event.end);
                            if (minResize <= event.start && !zeroDuration) {
                                addDay(minResize);
                            }
                        } else {
                            addDuration(minResize, $slotDuration);
                            if (minResize > event.end) {
                                minResize = event.end;
                            }
                            // Overwrite the date due to possible discrepancy between calculated date
                            // and resizer coordinates in browser
                            date = event.end;
                            if (!zeroDuration) {
                                date = subtractDuration(cloneDate(date), $slotDuration);
                            }
                        }
                    }

                    // Handle zero duration events
                    if (zeroDuration && !allDay) {
                        extraDuration = $slotDuration;
                    }
                }

                move(jsEvent);
            }
        }
    }

    export function select(jsEvent) {
        if (!action) {
            action = validJsEvent(jsEvent) ? (
                $selectable && !listView($view) ? ACTION_SELECT : ACTION_CLICK
            ) : ACTION_NO_ACTION;

            if (complexAction()) {
                common(jsEvent);

                iClass = 'selecting';

                selectStep = allDay ? createDuration({day: 1}) : $slotDuration;

                // Create dummy source event
                event = {
                    allDay,
                    start: date,
                    end: addDuration(cloneDate(date), selectStep),
                    resourceIds: resource ? [resource.id] : []
                };

                move(jsEvent);
            }
        }
    }

    export function noAction() {
        if (!action) {
            action = ACTION_NO_ACTION;
        }
    }

	function common(jsEvent) {
        window.getSelection().removeAllRanges();

        fromX = toX = jsEvent.clientX;
        fromY = toY = jsEvent.clientY;

        let dayEl = getElementWithPayload(toX, toY);
        ({allDay, date, resource} = getPayload(dayEl)(toX, toY));

        if (timelineView($view)) {
            bodyEl = clipEl = $_bodyEl;
        } else {
            bodyEl = ancestor(dayEl, resource ? 4 : 3);
            clipEl = ancestor(dayEl, resource && (dragging() || $datesAboveResources) ? 2 : 1);
        }
        calcViewport();

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
        if (
            interacting ||
            jsEvent && jsEvent.pointerType === 'mouse' && distance() >= (selecting() ? $selectMinDistance : $eventDragMinDistance)
        ) {
            interacting = true;
            unselect(jsEvent);
            $_iClass = iClass;

            if (!$_iEvents[0]) {
                if (selecting()) {
                    createIEventSelect();
                } else {
                    createIEvent(jsEvent, resizing() ? $eventResizeStart : $eventDragStart);
                }
            }

            let payload = findPayload(findDayEl());
            if (payload) {
                let newAllDay;
                ({allDay: newAllDay, date: newDate, resource: newResource} = payload);

                if (newAllDay === allDay) {
                    let candidate = copyIEventData({}, $_iEvents[0]);
                    let constraintFn = $resizeConstraint;
                    delta = createDuration((newDate - date) / 1000);
                    if (resizingStart()) {
                        // Resizing start
                        candidate.start = addDuration(cloneDate(event.start), delta);
                        if (candidate.start > minResize) {
                            candidate.start = minResize;
                            delta = createDuration((minResize - event.start) / 1000);
                        }
                    } else {
                        candidate.end = addDuration(cloneDate(event.end), delta);
                        if (extraDuration) {
                            addDuration(candidate.end, extraDuration);
                        }
                        if (resizing()) {
                            // Resizing end
                            if (candidate.end < minResize) {
                                candidate.end = minResize;
                                delta = createDuration((minResize - event.end) / 1000);
                            }
                        } else if (selecting()) {
                            // Selecting
                            if (candidate.end < event.end) {
                                candidate.start = subtractDuration(candidate.end, selectStep);
                                candidate.end = event.end;
                            } else {
                                candidate.start = event.start;
                            }
                            constraintFn = $selectConstraint;
                        } else {
                            // Dragging
                            candidate.start = addDuration(cloneDate(event.start), delta);
                            if (resource) {
                                candidate.resourceIds = event.resourceIds.filter(id => id !== resource.id);
                                candidate.resourceIds.push(newResource.id);
                            }
                            constraintFn = $dragConstraint;
                        }
                    }
                    // Check constraint
                    do {
                        if (constraintFn !== undefined) {
                            candidate = copyIEventData(cloneEvent(event), candidate);
                            let result = constraintFn(
                                selecting()
                                    ? createSelectCallbackInfo(candidate, jsEvent)
                                    : createCallbackInfo(candidate, event, jsEvent)
                            );
                            if (result === false) {
                                // Revert preview event
                                $_iEvents[0] = copyIEventData($_iEvents[0], event);
                                break;
                            }
                        }
                        // Update preview event
                        $_iEvents[0] = copyIEventData($_iEvents[0], candidate);
                    } while (0);
                }
            }
        }

        if ($dragScroll) {
            let thresholdY = $slotHeight * 2;
            let thresholdX = $slotWidth;
            animate(() => {
                if (bodyEl) {
                    if (toY < thresholdY) {
                        window.scrollBy(0, max(-10, (toY - thresholdY) / 3));
                    }
                    if (toY < bodyRect.top + thresholdY) {
                        bodyEl.scrollTop += max(-10, (toY - bodyRect.top - thresholdY) / 3);
                    }
                    if (toY > window.innerHeight - thresholdY) {
                        window.scrollBy(0, min(10, (toY - window.innerHeight + thresholdY) / 3));
                    }
                    if (toY > bodyRect.bottom - thresholdY) {
                        bodyEl.scrollTop += min(10, (toY - bodyRect.bottom + thresholdY) / 3);
                    }

                    if (timelineView($view)) {
                        if (toX < bodyRect.left + thresholdX) {
                            bodyEl.scrollLeft += max(-10, (toX - bodyRect.left - thresholdX) / 3);
                        }
                        if (toX > bodyRect.right - thresholdX) {
                            bodyEl.scrollLeft += min(10, (toX - bodyRect.right + thresholdX) / 3);
                        }
                    }
                }
            });
        }
    }

    export function handleScroll() {
        if (complexAction()) {
            calcViewport();
            move();
        }
    }

    function handlePointerMove(jsEvent) {
        if (complexAction() && jsEvent.isPrimary) {
            toX = jsEvent.clientX;
            toY = jsEvent.clientY;
            move(jsEvent);
        }
    }

    function handlePointerUp(jsEvent) {
        if (selected && $unselectAuto && !($unselectCancel && jsEvent.target.closest($unselectCancel))) {
            unselect(jsEvent);
        }
        if (action && jsEvent.isPrimary) {
            if (interacting) {
                if (selecting()) {
                    selected = true;
                    if (isFunction($selectFn)) {
                        let info = createSelectCallbackInfo($_iEvents[0], jsEvent);
                        $selectFn(info);
                    }
                } else {
                    event.display = display;

                    let callback = resizing() ? $eventResizeStop : $eventDragStop;
                    if (isFunction(callback)) {
                        callback({event: toEventWithLocalDates(event), jsEvent, view: toViewWithLocalDates($_view)});
                    }

                    let oldEvent = cloneEvent(event);
                    updateEvent(event, $_iEvents[0]);

                    destroyIEvent();

                    callback = resizing() ? $eventResize : $eventDrop;
                    if (isFunction(callback)) {
                        let eventRef = event;
                        let info = createCallbackInfo(event, oldEvent, jsEvent);
                        callback(assign(info, {
                            revert() {
                                updateEvent(eventRef, oldEvent);
                            }
                        }));
                    }
                }
            } else {
                if (clicking() || selecting()) {
                    // Perform date click
                    if (isFunction($dateClick) && !noDateClick) {
                        toX = jsEvent.clientX;
                        toY = jsEvent.clientY;
                        let dayEl = getElementWithPayload(toX, toY);
                        if (dayEl) {
                            let {allDay, date, resource} = getPayload(dayEl)(toX, toY);
                            $dateClick({
                                allDay,
                                date: toLocalDate(date),
                                dateStr: toISOString(date),
                                dayEl,
                                jsEvent,
                                view: toViewWithLocalDates($_view),
                                resource
                            });
                        }
                    }
                }
            }

            interacting = false;
            action = fromX = fromY = toX = toY = event = display = date = newDate = resource = newResource = delta =
                extraDuration = allDay = $_iClass = minResize = selectStep = margin = undefined;
            bodyEl = clipEl = bodyRect = clipRect = undefined;

            if (timer) {
                clearTimeout(timer);
                timer = undefined;
            }
        }

        noDateClick = false;
    }

    function findDayEl() {
        // Limit coordinates to viewport
        return getElementWithPayload(
            limit(toX, viewport[0], viewport[1]),
            limit(toY, viewport[2], viewport[3])
        );
    }

    function findPayload(dayEl) {
        if (dayEl) {
            let payload = getPayload(dayEl)(toX, toY);
            if (payload.disabled) {
                if (!$validRange.end || payload.date < $validRange.end) {
                    return findPayload(dayEl.nextElementSibling);
                }
                if (!$validRange.start || payload.date > $validRange.start) {
                    return findPayload(dayEl.previousElementSibling);
                }
            } else {
                return payload;
            }
        }
        return null;
    }

    function calcViewport() {
        bodyRect = rect(bodyEl);
        clipRect = rect(clipEl);
        viewport = [
            max(0, clipRect.left + (timelineView($view) ? 1 : ($_dayGrid ? 0 : 8))),  // left
            min(document.documentElement.clientWidth, clipRect.left + clipEl.clientWidth) - 2,  // right
            max(0, bodyRect.top),  // top
            min(document.documentElement.clientHeight, bodyRect.top + bodyEl.clientHeight) - 2  // bottom
        ];
    }

    function createIEvent(jsEvent, callback) {
        if (isFunction(callback)) {
            callback({event: toEventWithLocalDates(event), jsEvent, view: toViewWithLocalDates($_view)});
        }
        display = event.display;
        event.display = 'preview';
        $_iEvents[0] = cloneEvent(event);
        if (margin !== undefined) {
            $_iEvents[0]._margin = margin;
        }
        if (extraDuration) {
            addDuration($_iEvents[0].end, extraDuration);
        }
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
            resourceIds: event.resourceIds,
            classNames: [],
            styles: []
        };
    }

    function destroyIEvent() {
        $_iEvents[0] = null;
    }

    function copyIEventData(target, source) {
        target.start = source.start;
        target.end = source.end;
        target.resourceIds = source.resourceIds;
        return target;
    }

    function updateEvent(target, source) {
        copyIEventData(target, source);
        $_events = $_events;
    }

    function createSelectCallbackInfo(event, jsEvent) {
        let {start, end} = toEventWithLocalDates(event);
        return {
            start,
            end,
            startStr: toISOString(event.start),
            endStr: toISOString(event.end),
            allDay,
            view: toViewWithLocalDates($_view),
            resource,
            jsEvent
        };
    }

    function createCallbackInfo(event, oldEvent, jsEvent) {
        let info;
        if (resizing()) {
            info = resizingStart()
                ? {startDelta: delta, endDelta: createDuration(0)}
                : {startDelta: createDuration(0), endDelta: delta};
        } else {
            info = {
                delta,
                oldResource: resource !== newResource ? resource : undefined,
                newResource: resource !== newResource ? newResource : undefined
            };
        }
        assign(info, {
            event: toEventWithLocalDates(event),
            oldEvent: toEventWithLocalDates(oldEvent),
            view: toViewWithLocalDates($_view),
            jsEvent
        });

        return info;
    }

    function distance() {
        return Math.sqrt(Math.pow(toX - fromX, 2) + Math.pow(toY - fromY, 2));
    }

    function dragging() {
        return action === ACTION_DRAG;
    }

    function resizing() {
        return action === ACTION_RESIZE_END || resizingStart();
    }

    function resizingStart() {
        return action === ACTION_RESIZE_START;
    }

    function clicking() {
        return action === ACTION_CLICK;
    }

    function selecting() {
        return action === ACTION_SELECT;
    }

    function complexAction() {
        return action && action < ACTION_CLICK;
    }

    function validJsEvent(jsEvent) {
        return jsEvent.isPrimary && (jsEvent.pointerType !== 'mouse' || jsEvent.buttons & 1);
    }

    export function unselect(jsEvent) {
        if (selected) {
            selected = false;
            destroyIEvent();
            if (isFunction($unselectFn)) {
                $unselectFn({
                    jsEvent,
                    view: toViewWithLocalDates($_view)
                });
            }
        }
    }

    export function noClick() {
        noDateClick = true;
    }

    // Clear selection on view params change
    _view.subscribe(unselect);

    function handleTouchStart(jsEvent) {
        if (complexAction()) {
            let target = jsEvent.target;
            let stops = [];
            let stop = () => runAll(stops);
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
    on:selectstart={createPreventDefaultHandler(complexAction)}
    on:contextmenu={createPreventDefaultHandler(() => timer)}
    on:touchstart={handleTouchStart}
    on:touchmove|nonpassive
/>
