<script>
    import {getContext} from 'svelte';
    import {is_function, listen, run_all} from 'svelte/internal';
    import {
        addDay,
        addDuration,
        ancestor,
        assign,
        cloneDate,
        cloneEvent,
        createDuration,
        getElementWithPayload,
        getPayload,
        min, max,
        rect,
        subtractDuration,
        toEventWithLocalDates,
        toISOString,
        toLocalDate,
        toViewWithLocalDates,
        listView, timelineView
    } from '@event-calendar/core';
    import {animate, limit} from './utils';

    let {_iEvents, _iClass, _events, _view, _dayGrid, _draggable, _bodyEl, dateClick, dragScroll, datesAboveResources,
        eventDragMinDistance, eventDragStart, eventDragStop, eventDrop, eventLongPressDelay,
        eventResizeStart, eventResizeStop, eventResize, longPressDelay, selectable, select: selectFn,
        selectBackgroundColor, selectLongPressDelay, selectMinDistance, slotDuration, slotHeight, slotWidth, unselect: unselectFn,
        unselectAuto, unselectCancel, view} = getContext('state');

    const ACTION_DRAG = 1;
    const ACTION_RESIZE = 2;
    const ACTION_SELECT = 3;
    const ACTION_CLICK = 4;
    const ACTION_NO_ACTION = 5;
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
    let minEnd;  // minimum end time when resizing
    let selectStep;  // minimum selection step
    let selected;  // whether selection has been made
    let noDateClick;  // do not perform date click
    let timer;  // timer for long press delays
    let viewport;
    let margin;

    export function drag(eventToDrag, jsEvent, resize, forceDate, forceMargin) {
        if (!action) {
            action = validJsEvent(jsEvent) ? (
                resize ? ACTION_RESIZE : (
                    $_draggable(eventToDrag) ? ACTION_DRAG : ACTION_NO_ACTION
                )
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

                iClass = resize ? (resize == 'x' ? 'resizingX' : 'resizingY') : 'dragging';

                if (resize) {
                    minEnd = cloneDate(event.start);
                    if (allDay) {
                        minEnd.setUTCHours(event.end.getUTCHours(), event.end.getUTCMinutes(), event.end.getUTCSeconds(), 0);
                        if (minEnd < event.start) {
                            addDay(minEnd);
                            // minEnd = addDuration(cloneDate(event.start), $slotDuration);  alternative version
                        }
                    } else {
                        addDuration(minEnd, $slotDuration);
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

            let dayEl = findDayEl();
            if (dayEl) {
                let newAllDay;
                ({allDay: newAllDay, date: newDate, resource: newResource} = getPayload(dayEl)(toX, toY));

                if (newAllDay === allDay) {
                    delta = createDuration((newDate - date) / 1000);
                    $_iEvents[0].end = addDuration(cloneDate(event.end), delta);
                    if (resizing()) {
                        // Resizing
                        if ($_iEvents[0].end < minEnd) {
                            $_iEvents[0].end = minEnd;
                        }
                    } else if (selecting()) {
                        // Selecting
                        if ($_iEvents[0].end < event.end) {
                            $_iEvents[0].start = subtractDuration($_iEvents[0].end, selectStep);
                            $_iEvents[0].end = event.end;
                        } else {
                            $_iEvents[0].start = event.start;
                        }
                    } else {
                        // Dragging
                        $_iEvents[0].start = addDuration(cloneDate(event.start), delta);
                        if (resource) {
                            $_iEvents[0].resourceIds = event.resourceIds.filter(id => id !== resource.id);
                            $_iEvents[0].resourceIds.push(newResource.id);
                        }
                    }
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
                    if (is_function($selectFn)) {
                        let {start, end} = toEventWithLocalDates($_iEvents[0]);
                        $selectFn({
                            start,
                            end,
                            startStr: toISOString($_iEvents[0].start),
                            endStr: toISOString($_iEvents[0].end),
                            allDay,
                            jsEvent,
                            view: toViewWithLocalDates($_view),
                            resource
                        });
                    }
                } else {
                    event.display = display;

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
                        let info;
                        if (resizing()) {
                            info = {endDelta: delta};
                        } else {
                            info = {
                                delta,
                                oldResource: resource !== newResource ? resource : undefined,
                                newResource: resource !== newResource ? newResource : undefined
                            };
                        }
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
            } else {
                if (clicking() || selecting()) {
                    // Perform date click
                    if (is_function($dateClick) && !noDateClick) {
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
                allDay = $_iClass = minEnd = selectStep = margin = undefined;
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
        if (is_function(callback)) {
            callback({event: toEventWithLocalDates(event), jsEvent, view: toViewWithLocalDates($_view)});
        }
        display = event.display;
        event.display = 'preview';
        $_iEvents[0] = cloneEvent(event);
        if (margin !== undefined) {
            $_iEvents[0]._margin = margin;
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
            if (is_function($unselectFn)) {
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
    on:selectstart={createPreventDefaultHandler(complexAction)}
    on:contextmenu={createPreventDefaultHandler(() => timer)}
    on:touchstart={handleTouchStart}
    on:touchmove|nonpassive
/>
