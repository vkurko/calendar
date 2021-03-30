<script>
    import {getContext} from 'svelte';
    import {is_function} from 'svelte/internal';
    import {addDuration, cloneDate, cloneEvent, createDuration, rect,
        toEventWithLocalDates, toViewWithLocalDates} from '@event-calendar/common';
    import {traverseTimeGrid, animate, traverseResourceTimeGrid, traverseDayGrid} from './utils';

    let {_dragEvent, _events, _viewDates, eventDragStart, eventDragStop, eventDrop, dragScroll,
        slotDuration, hiddenDays, _view, theme} = getContext('state');

    let dragging = false;
    let event;
    let dayCol, dayRow;
    let offset;
    let toX, toY;
    let delta;
    let dayEl, daysEls, bodyEl;
    let dayRect, bodyRect;
    let _viewResources;
    let resourceCol, newResourceCol;

    export function startTimeGrid(event, el, jsEvent, resourcesStore) {
        if (!dragging) {
            if (resourcesStore) {
                [dayEl, bodyEl, dayCol, resourceCol] = traverseResourceTimeGrid(el);
            } else {
                [dayEl, bodyEl, dayCol] = traverseTimeGrid(el);
            }

            start(event, el, jsEvent);

            offset = Math.floor((jsEvent.clientY - dayRect.top) / 24);

            _viewResources = resourcesStore;

            dragging = 1;
        }
    }

    export function startDayGrid(event, el, jsEvent) {
        if (!dragging) {
            [dayEl, bodyEl, dayCol, dayRow, daysEls] = traverseDayGrid(el);

            start(event, el, jsEvent);

            offset = Math.floor((jsEvent.clientX - dayRect.left) / dayRect.width);

            dragging = 2;
        }
    }

	function start(eventToDrag, el, jsEvent) {
        event = eventToDrag;

        dayRect = rect(dayEl);
        bodyRect = rect(bodyEl);

        toX = jsEvent.clientX;
        toY = jsEvent.clientY;
    }

    function move(jsEvent) {
        let rx = toX - dayRect.left;
        let ry = toY - dayRect.top;

        let deltaDCol = Math.floor(rx / dayRect.width);

        if (dragging === 1) {
            // timeGrid
            if (_viewResources) {
                let deltaRCol = Math.floor((dayCol + deltaDCol) / $_viewDates.length);
                newResourceCol = Math.max(0, Math.min($_viewResources.length - 1, resourceCol + deltaRCol));
                deltaDCol -= (newResourceCol - resourceCol) * $_viewDates.length;

                if ($_dragEvent || newResourceCol !== resourceCol) {
                    if (!$_dragEvent) {
                        createDragEvent(jsEvent);
                    }
                    $_dragEvent.resourceIds = event.resourceIds.filter(id => id !== $_viewResources[resourceCol].id);
                    $_dragEvent.resourceIds.push($_viewResources[newResourceCol].id);
                }
            }

            let dCol = Math.max(0, Math.min($_viewDates.length - 1, dayCol + deltaDCol));
            let step = $slotDuration.seconds / 60;

            delta = createDuration({
                days: ($_viewDates[dCol] - $_viewDates[dayCol]) / 1000 / 60 / 60 / 24,
                minutes: (Math.floor(ry / 24) - offset) * step
            });
        } else {
            // dayGrid
            let cols = 7 - $hiddenDays.length;
            let col = Math.max(0, Math.min(cols - 1, dayCol + deltaDCol));
            let row = dayRow;
            while (true) {
                if (ry < 0) {
                    if (row > 0) {
                        --row;
                        ry += daysEls[row].offsetHeight;
                        if (ry < 0) {
                            continue
                        }
                    }
                } else {
                    ry -= daysEls[row].offsetHeight;
                    if (ry > 0) {
                        if (row < daysEls.length - 1) {
                            ++row;
                            continue;
                        }
                    }
                }
                break;
            }

            delta = createDuration({
                days: ($_viewDates[row * cols + col] - $_viewDates[dayRow * cols + dayCol]) / 1000 / 60 / 60 / 24 - offset,
            });
        }

        if ($_dragEvent || delta.days || delta.seconds) {
            if (!$_dragEvent) {
                createDragEvent(jsEvent);
            }
            $_dragEvent.start = addDuration(cloneDate(event.start), delta);
            $_dragEvent.end = addDuration(cloneDate(event.end), delta);
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
            dayRect = rect(dayEl);
            bodyRect = rect(bodyEl);
            move();
        }
    }

    function handleMouseMove(jsEvent) {
        if (dragging) {
            toX = jsEvent.clientX;
            toY = jsEvent.clientY;
            move(jsEvent);
        }
    }

    function handleMouseUp(jsEvent) {
        if (dragging) {
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
            dayEl = daysEls = bodyEl = null;
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

    function handleSelectStart(jsEvent) {
        if (dragging) {
            jsEvent.preventDefault();
        }
    }
</script>

<svelte:window
    on:mousemove={handleMouseMove}
    on:mouseup={handleMouseUp}
    on:selectstart={handleSelectStart}
    on:scroll={handleScroll}
/>
