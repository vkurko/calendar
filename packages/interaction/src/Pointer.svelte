<script>
    import {getContext} from 'svelte';
    import {addDuration, cloneDate, rect} from '@event-calendar/common';
    import {floor} from './utils';

    let {_interactionEvents, _events, _viewDates, slotDuration, slotHeight, hiddenDays, _view, datesAboveResources,
        theme} = getContext('state');

    let y;
    let colDate;
    let colEl;
    let colRect;
    let resource;

    let _slotTimeLimits;

    let date;

    $: if ($_interactionEvents[0]) {
        removePointerEvent();
    }

    export function enterTimeGrid(date, el, jsEvent, slotTimeLimitsStore, resourceObj) {
        if (validEvent(jsEvent)) {
            colDate = date;
            colEl = el;
            colRect = rect(colEl);

            y = jsEvent.clientY;

            _slotTimeLimits = slotTimeLimitsStore;
            resource = resourceObj;
        }
    }

    export function enterDayGrid(date, jsEvent) {
        if (validEvent(jsEvent)) {
            colDate = date;
            colEl = null;

            y = _slotTimeLimits = resource = undefined;
        }
    }

    export function leave(jsEvent) {
        if (validEvent(jsEvent)) {
            removePointerEvent();
        }
    }

    function move() {
        if (!colDate) {
            return;
        }

        if (colEl) {
            // timeGrid
            let ry = y - colRect.top;
            date = addDuration(
                cloneDate(colDate),
                $slotDuration,
                floor(ry / $slotHeight + $_slotTimeLimits.min.seconds / $slotDuration.seconds)
            );
        } else {
            // dayGrid
            date = colDate;
        }

        if (!$_interactionEvents[1]) {
            createPointerEvent();
        }
        $_interactionEvents[1].start = date;
        $_interactionEvents[1].end = addDuration(cloneDate(date), $slotDuration);
        $_interactionEvents[1].resourceIds = resource ? [resource.id] : [];
    }

    export function handleScroll() {
        if (colEl) {
            colRect = rect(colEl);
            move();
        }
    }

    function handlePointerMove(jsEvent) {
        if (validEvent(jsEvent)) {
            y = jsEvent.clientY;
            move();
        }
    }

    function createPointerEvent() {
        $_interactionEvents[1] = {
            id: '{pointer}',
            title: '',
            display: 'pointer',
            extendedProps: {},
            backgroundColor: 'transparent'
        };
    }

    function removePointerEvent() {
        colDate = colEl = $_interactionEvents[1] = null;
    }

    function validEvent(jsEvent) {
        return jsEvent.isPrimary && jsEvent.pointerType === 'mouse';
    }
</script>

<svelte:window
    on:pointermove={handlePointerMove}
    on:scroll={handleScroll}
/>
