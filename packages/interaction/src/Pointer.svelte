<script>
    import {getContext} from 'svelte';
    import {addDuration, cloneDate, getElementWithPayload, getPayload} from '@event-calendar/core';

    let {_iEvents, slotDuration} = getContext('state');

    let x = 0, y = 0;

    $: if ($_iEvents[0]) {
        removePointerEvent();
    }

    export function leave(jsEvent) {
        if (validEvent(jsEvent)) {
            removePointerEvent();
        }
    }

    function move() {
        let dayEl = getElementWithPayload(x, y);

        if (dayEl) {
            let {allDay, date, resource} = getPayload(dayEl)(x, y);
            let idx = allDay ? 2 : 1;

            if (!$_iEvents[idx]) {
                createPointerEvent(idx);
            }
            $_iEvents[idx].start = date;
            $_iEvents[idx].end = addDuration(cloneDate(date), $slotDuration);
            $_iEvents[idx].resourceIds = resource ? [resource.id] : [];
        }
    }

    export function handleScroll() {
        move();
    }

    function handlePointerMove(jsEvent) {
        if (validEvent(jsEvent)) {
            x = jsEvent.clientX;
            y = jsEvent.clientY;
            move();
        }
    }

    function createPointerEvent(idx) {
        $_iEvents[idx] = {
            id: '{pointer}',
            title: '',
            display: 'pointer',
            extendedProps: {},
            backgroundColor: 'transparent',
            classNames: [],
            styles: []
        };
    }

    function removePointerEvent() {
        $_iEvents[1] = null;
        $_iEvents[2] = null;
    }

    function validEvent(jsEvent) {
        return jsEvent.isPrimary && jsEvent.pointerType === 'mouse';
    }
</script>

<svelte:window
    on:pointermove={handlePointerMove}
    on:scroll={handleScroll}
/>
