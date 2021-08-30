<script>
    import {getContext} from 'svelte';
    import {is_function} from 'svelte/internal';
    import {addDuration, cloneDate, cloneEvent, createDuration, rect,
        toEventWithLocalDates, toViewWithLocalDates} from '@event-calendar/common';
    import {traverseTimeGrid, animate, traverseResourceTimeGrid, traverseDayGrid, limit, floor} from './utils';

    let {_dragEvent, _events, _viewDates, eventDragMinDistance, eventDragStart, eventDragStop, eventDrop, dragScroll,
        slotDuration, slotHeight, hiddenDays, _view, datesAboveResources, theme} = getContext('state');

    let dragging = false;
    let event;
    let col, row;
    let offset;
    let fromX, fromY;
    let toX, toY;
    let delta;
    let colEl, rowEls, bodyEl;
    let colRect, bodyRect;
    let _viewResources;
    let resourceCol, newResourceCol;

    export function startTimeGrid(event, el, jsEvent, resourcesStore) {
        if (!dragging && jsEvent.isPrimary) {
            if (resourcesStore) {
                [colEl, bodyEl, col, resourceCol] = traverseResourceTimeGrid(el, $datesAboveResources);
            } else {
                [colEl, bodyEl, col] = traverseTimeGrid(el);
            }

            start(event, jsEvent);

            offset = floor((jsEvent.clientY - colRect.top) / $slotHeight);

            _viewResources = resourcesStore;

            dragging = 1;
        }
    }

    export function startDayGrid(event, el, jsEvent) {
        if (!dragging && jsEvent.isPrimary) {
            [colEl, bodyEl, col, row, rowEls] = traverseDayGrid(el);

            start(event, jsEvent);

            offset = floor((jsEvent.clientX - colRect.left) / colRect.width) - col;

            _viewResources = undefined;

            dragging = 2;
        }
    }

	function start(eventToDrag, jsEvent) {
        window.getSelection().removeAllRanges();

        event = eventToDrag;

        colRect = rect(colEl);
        bodyRect = rect(bodyEl);

        fromX = toX = jsEvent.clientX;
        fromY = toY = jsEvent.clientY;
    }

    function move(jsEvent) {
        let rx = toX - colRect.left;
        let ry = toY - colRect.top;

        let newCol = floor(rx / colRect.width);

        if (dragging === 1) {
            // timeGrid
            if (_viewResources) {
                if ($datesAboveResources) {
                    let dayCol = limit(floor(newCol / $_viewResources.length), $_viewDates.length - 1);
                    newResourceCol = limit(newCol - dayCol * $_viewResources.length, $_viewResources.length - 1);
                    newCol = dayCol;
                } else {
                    newResourceCol = limit(floor(newCol / $_viewDates.length), $_viewResources.length - 1);
                    newCol -= newResourceCol * $_viewDates.length;
                }
            }

            newCol = limit(newCol, $_viewDates.length - 1);

            delta = createDuration({
                days: ($_viewDates[newCol] - $_viewDates[col]) / 1000 / 60 / 60 / 24,
                seconds: (floor(ry / $slotHeight) - offset) * $slotDuration.seconds
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
                days: ($_viewDates[newRow * cols + newCol] - $_viewDates[row * cols + col]) / 1000 / 60 / 60 / 24 - offset,
            });
        }

        if ($_dragEvent || distance() >= $eventDragMinDistance) {
            if (!$_dragEvent) {
                createDragEvent(jsEvent);
            }
            $_dragEvent.start = addDuration(cloneDate(event.start), delta);
            $_dragEvent.end = addDuration(cloneDate(event.end), delta);
            if (_viewResources) {
                $_dragEvent.resourceIds = event.resourceIds.filter(id => id !== $_viewResources[resourceCol].id);
                $_dragEvent.resourceIds.push($_viewResources[newResourceCol].id);
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

    export function classes(display, className) {
        switch (display) {
            case 'auto': return `${className} ${$theme.draggable}`;
            case 'ghost': return `${$theme.event} ${$theme.ghost}`;
            case 'preview': return `${$theme.event} ${$theme.preview}`;
            default: return className;
        }
    }

    export function handleScroll() {
        if (dragging) {
            colRect = rect(colEl);
            bodyRect = rect(bodyEl);
            move();
        }
    }

    function handlePointerMove(jsEvent) {
        if (dragging && jsEvent.isPrimary) {
            toX = jsEvent.clientX;
            toY = jsEvent.clientY;
            move(jsEvent);
        }
    }

    function handlePointerUp(jsEvent) {
        if (dragging && jsEvent.isPrimary) {
            if ($_dragEvent) {
                event.display = 'auto';

                if (is_function($eventDragStop)) {
                    $eventDragStop({event: toEventWithLocalDates(event), jsEvent, view: toViewWithLocalDates($_view)});
                }

                let oldEvent = cloneEvent(event);
                updateEvent(event, $_dragEvent);
                $_dragEvent = null;

                if (is_function($eventDrop)) {
                    let eventRef = event;
                    $eventDrop({
                        event: toEventWithLocalDates(event),
                        oldEvent: toEventWithLocalDates(oldEvent),
                        oldResource: resourceCol !== newResourceCol ? $_viewResources[resourceCol] : undefined,
                        newResource: resourceCol !== newResourceCol ? $_viewResources[newResourceCol] : undefined,
                        delta,
                        jsEvent,
                        view: toViewWithLocalDates($_view),
                        revert() {
                            updateEvent(eventRef, oldEvent);
                        }
                    });
                }
            }
            colEl = rowEls = bodyEl = null;
            resourceCol = newResourceCol = undefined;
            dragging = false;
        }
    }

    function createDragEvent(jsEvent) {
        if (is_function($eventDragStart)) {
            $eventDragStart({event: toEventWithLocalDates(event), jsEvent, view: toViewWithLocalDates($_view)});
        }
        event.display = 'preview';
        $_dragEvent = cloneEvent(event);
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
        if (dragging) {
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
