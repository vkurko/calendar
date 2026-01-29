<script>
    import {getContext, onMount} from 'svelte';
    import {
        addDay, addDuration, ancestor, assign, cloneDate, cloneEvent, copyTime, createDuration, getElementWithPayload,
        getPayload, isFunction, isRtl, listen, max, min, noop, rect, runAll, subtractDay, subtractDuration,
        toEventWithLocalDates, toISOString, toLocalDate, toViewWithLocalDates
    } from '#lib';
    import {animate, limit, eventDraggable} from './lib';

    let mainState = getContext('state');
    let {events, iEvents, features, view, mainEl, options: {dateClick, dragConstraint, dragScroll, editable,
        eventStartEditable, eventDragMinDistance, eventDragStart, eventDragStop, eventDrop,
        eventLongPressDelay, eventResizeStart, eventResizeStop, eventResize, longPressDelay, resizeConstraint,
        selectable, select: selectFn, selectBackgroundColor, selectConstraint, selectLongPressDelay, selectMinDistance,
        unselect: unselectFn, unselectAuto, unselectCancel, validRange}
    } = $derived(mainState);

    const ACTION_DRAG = 1;
    const ACTION_RESIZE_END = 2;
    const ACTION_RESIZE_START = 3;
    const ACTION_SELECT = 4;
    const ACTION_CLICK = 5;
    const ACTION_NO_ACTION = 6;
    let action;
    let interacting;
    let event;
    let iEvent;
    let display;
    let date, newDate;
    let resource, newResource;
    let fromX, fromY;
    let toX, toY;
    let gridEl, allDaySlot;
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
    let snapDuration;  // step for timeGrid views
    let extraDuration;  // extra duration for zero duration events

    export function draggable(event) {
        return eventDraggable(event, eventStartEditable, editable);
    }

    export function drag(eventToDrag, jsEvent, forceDate, forceMargin, snap) {
        if (!action) {
            action = validJsEvent(jsEvent) ? ACTION_DRAG : ACTION_NO_ACTION;

            if (complexAction()) {
                event = eventToDrag;

                common(jsEvent, snap);

                if (forceDate) {
                    // Force date in popup
                    date = forceDate;
                }

                if (forceMargin) {
                    margin = forceMargin;
                }

                iClass = 'dragging';

                move(jsEvent);
            }
        }
    }

    export function resize(eventToResize, jsEvent, start, axis, forceDate, forceMargin, zeroDuration, snap) {
        if (!action) {
            action = validJsEvent(jsEvent) ? (
                start ? ACTION_RESIZE_START : ACTION_RESIZE_END
            ) : ACTION_NO_ACTION;

            if (complexAction()) {
                event = eventToResize;

                common(jsEvent, snap);

                if (forceDate) {
                    // Force date in popup
                    date = forceDate;
                }

                if (forceMargin) {
                    margin = forceMargin;
                }

                iClass = axis === 'x' ? 'resizingX' : 'resizingY';

                // Calculate the limits for resize
                if (resizingStart()) {
                    minResize = cloneDate(event.end);
                    if (allDay) {
                        copyTime(minResize, event.start);
                        if (minResize >= event.end) {
                            subtractDay(minResize);
                        }
                    } else {
                        subtractDuration(minResize, snapDuration);
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
                        addDuration(minResize, snapDuration);
                        if (minResize > event.end) {
                            minResize = event.end;
                        }
                        // Overwrite the date due to possible discrepancy between calculated date
                        // and resizer coordinates in browser
                        date = event.end;
                        if (!zeroDuration) {
                            date = subtractDuration(cloneDate(date), snapDuration);
                        }
                    }

                    // Handle zero duration events
                    if (zeroDuration && !allDay) {
                        extraDuration = snapDuration;
                    }
                }

                move(jsEvent);
            }
        }
    }

    export function select(jsEvent, snap) {
        if (!action) {
            action = validJsEvent(jsEvent) ? (
                selectable && !features.includes('list') ? ACTION_SELECT : ACTION_CLICK
            ) : ACTION_NO_ACTION;

            if (complexAction()) {
                common(jsEvent, snap);

                iClass = 'selecting';

                selectStep = allDay ? createDuration({day: 1}) : snapDuration;

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

	function common(jsEvent, snap) {
        window.getSelection().removeAllRanges();

        fromX = toX = jsEvent.clientX;
        fromY = toY = jsEvent.clientY;

        snapDuration = snap?.duration;

        let dayEl = getElementWithPayload(toX, toY);
        ({allDay, date, resource} = getPayload(dayEl)(toX, toY));

        allDaySlot = mainEl !== ancestor(dayEl, 3);
        gridEl = ancestor(dayEl, 1);
        calcViewport();

        if (jsEvent.pointerType !== 'mouse') {
            // For touch devices init long press delay
            timer = setTimeout(() => {
                if (action) {
                    interacting = true;
                    move(jsEvent);
                }
            }, (selecting() ? selectLongPressDelay : eventLongPressDelay) ?? longPressDelay);
        }
    }

    function move(jsEvent) {
        if (
            interacting ||
            jsEvent && jsEvent.pointerType === 'mouse' && distance() >= (selecting() ? selectMinDistance : eventDragMinDistance)
        ) {
            interacting = true;
            unselect(jsEvent);
            mainState.iClass = iClass;

            if (!iEvent) {
                if (selecting()) {
                    createIEventSelect();
                } else {
                    createIEvent(jsEvent, resizing() ? eventResizeStart : eventDragStart);
                }
            }

            let payload = findPayload(findDayEl());
            if (payload) {
                let newAllDay;
                ({allDay: newAllDay, date: newDate, resource: newResource} = payload);

                if (newAllDay === allDay) {
                    let candidate = copyIEventData({}, iEvent);
                    let constraintFn = resizeConstraint;
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
                            constraintFn = selectConstraint;
                        } else {
                            // Dragging
                            candidate.start = addDuration(cloneDate(event.start), delta);
                            if (resource) {
                                candidate.resourceIds = event.resourceIds.filter(id => id !== resource.id);
                                candidate.resourceIds.push(newResource.id);
                            }
                            constraintFn = dragConstraint;
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
                                updateIEvent(event);
                                break;
                            }
                        }
                        // Update preview event
                        updateIEvent(candidate);
                    } while (0);
                }
            }
        }

        if (dragScroll) {
            let thresholdY = 24;
            let thresholdX = 24;
            animate(() => {
                if (viewport) {
                    if (!allDaySlot) {
                        if (toY < viewport.top + thresholdY) {
                            mainEl.scrollTop += max(-8, (toY - viewport.top - thresholdY) / 3);
                        }
                        if (toY > viewport.bottom - thresholdY) {
                            mainEl.scrollTop += min(8, (toY - viewport.bottom + thresholdY) / 3);
                        }
                    }
                    if (toX < viewport.left + thresholdX) {
                        mainEl.scrollLeft += max(-8, (toX - viewport.left - thresholdX) / 3);
                    }
                    if (toX > viewport.right - thresholdX) {
                        mainEl.scrollLeft += min(8, (toX - viewport.right + thresholdX) / 3);
                    }
                    if (toY < thresholdY) {
                        window.scrollBy(0, max(-8, (toY - thresholdY) / 3));
                    }
                    if (toY > window.innerHeight - thresholdY) {
                        window.scrollBy(0, min(8, (toY - window.innerHeight + thresholdY) / 3));
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
        if (selected && unselectAuto && !(unselectCancel && jsEvent.target.closest(unselectCancel))) {
            unselect(jsEvent);
        }
        if (action && jsEvent.isPrimary) {
            if (interacting) {
                if (selecting()) {
                    selected = true;
                    if (isFunction(selectFn)) {
                        let info = createSelectCallbackInfo(iEvent, jsEvent);
                        selectFn(info);
                    }
                } else {
                    event.display = display;

                    let callback = resizing() ? eventResizeStop : eventDragStop;
                    if (isFunction(callback)) {
                        callback({
                            event: toEventWithLocalDates(event),
                            jsEvent,
                            view: toViewWithLocalDates(view)
                        });
                    }

                    let oldEvent = cloneEvent(event);
                    updateEvent(event, iEvent);

                    destroyIEvent();

                    callback = resizing() ? eventResize : eventDrop;
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
                    if (isFunction(dateClick) && !noDateClick) {
                        toX = jsEvent.clientX;
                        toY = jsEvent.clientY;
                        let dayEl = getElementWithPayload(toX, toY);
                        if (dayEl) {
                            let {allDay, date, resource} = getPayload(dayEl)(toX, toY);
                            dateClick({
                                allDay,
                                date: toLocalDate(date),
                                dateStr: toISOString(date),
                                dayEl,
                                jsEvent,
                                view: toViewWithLocalDates(view),
                                resource
                            });
                        }
                    }
                }
            }
            handlePointerCancel();
        }

        noDateClick = false;
    }

    function handlePointerCancel() {
        interacting = false;
        action = fromX = fromY = toX = toY = event = display = date = newDate = resource = newResource = delta =
            extraDuration = allDay = minResize = selectStep = margin = gridEl = viewport = snapDuration = undefined;
        mainState.iClass = undefined;

        if (timer) {
            clearTimeout(timer);
            timer = undefined;
        }
    }

    function findDayEl() {
        // Limit coordinates to viewport
        return getElementWithPayload(
            limit(toX, viewport.left, viewport.right),
            limit(toY, viewport.top, viewport.bottom)
        );
    }

    function findPayload(dayEl) {
        if (dayEl) {
            let payload = getPayload(dayEl)(toX, toY);
            if (payload.disabled) {
                if (!validRange.end || payload.date < validRange.end) {
                    return findPayload(dayEl.nextElementSibling);
                }
                if (!validRange.start || payload.date > validRange.start) {
                    return findPayload(dayEl.previousElementSibling);
                }
            } else {
                if (
                    (selecting() || resizing()) &&
                    payload.resource && !iEvent.resourceIds.includes(payload.resource.id) && !features.includes('timeline')
                ) {
                    if (toX > fromX) {
                        return findPayload(dayEl.previousElementSibling);
                    } else {
                        return findPayload(dayEl.nextElementSibling);
                    }
                }
                return payload;
            }
        }
        return null;
    }

    function calcViewport() {
        let mainRect = rect(mainEl);
        let gridRect = rect(gridEl);
        let scaleX = mainRect.width / mainEl.offsetWidth;
        let scaleY = mainRect.height / mainEl.offsetHeight;
        let rtl = isRtl();
        viewport = {
            left: max(0, rtl
                ? mainRect.right - mainEl.clientWidth * scaleX
                : gridRect.left + mainEl.scrollLeft * scaleX
            ),
            right: min(document.documentElement.clientWidth, rtl
                ? gridRect.right + mainEl.scrollLeft * scaleX
                : mainRect.left + mainEl.clientWidth * scaleX
            ) - 2,
            top: max(0, gridRect.top + (!allDaySlot ? mainEl.scrollTop : 0) * scaleY),
            bottom: min(document.documentElement.clientHeight, !allDaySlot
                ? mainRect.top + mainEl.clientHeight * scaleY
                : gridRect.bottom
            ) - 2
        };
    }

    function createIEvent(jsEvent, callback) {
        if (isFunction(callback)) {
            callback({
                event: toEventWithLocalDates(event),
                jsEvent,
                view: toViewWithLocalDates(view)
            });
        }
        display = event.display;
        event.display = 'preview';
        iEvent = cloneEvent(event);
        if (margin !== undefined) {
            iEvent._margin = margin;
        }
        if (extraDuration) {
            addDuration(iEvent.end, extraDuration);
        }
        event.display = 'ghost';
        mainState.events = [...events];
    }

    function createIEventSelect() {
        iEvent = {
            id: '{select}',
            allDay: event.allDay,
            start: event.start,
            title: '',
            display: 'preview',
            extendedProps: {},
            backgroundColor: selectBackgroundColor,
            resourceIds: event.resourceIds,
            classNames: [],
            styles: []
        };
    }

    function destroyIEvent() {
        iEvent = undefined;
        iEvents.delete('action');
    }

    function copyIEventData(target, source) {
        target.start = source.start;
        target.end = source.end;
        target.resourceIds = source.resourceIds;
        return {...target};
    }

    function updateEvent(target, source) {
        copyIEventData(target, source);
        mainState.events = [...events];
    }

    function updateIEvent(source) {
        iEvent = copyIEventData(iEvent, source);
        iEvents.set('action', iEvent);
    }

    function createSelectCallbackInfo(event, jsEvent) {
        let {start, end} = toEventWithLocalDates(event);
        return {
            start,
            end,
            startStr: toISOString(event.start),
            endStr: toISOString(event.end),
            allDay,
            view: toViewWithLocalDates(view),
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
            view: toViewWithLocalDates(view),
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
            if (isFunction(unselectFn)) {
                unselectFn({
                    jsEvent,
                    view: toViewWithLocalDates(view)
                });
            }
        }
    }

    // Clear selection when view changes
    $effect.pre(() => {
        view;
        unselect();
    });

    export function noClick() {
        noDateClick = true;
    }

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

    onMount(() => listen(window, 'touchmove', noop, {passive: false}));
</script>

<svelte:window
    onpointermove={handlePointerMove}
    onpointerup={handlePointerUp}
    onpointercancel={handlePointerCancel}
    onscroll={handleScroll}
    onselectstart={createPreventDefaultHandler(complexAction)}
    oncontextmenu={createPreventDefaultHandler(() => timer)}
    ontouchstart={handleTouchStart}
/>
