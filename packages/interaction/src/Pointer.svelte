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
            let {date, resource} = getPayload(dayEl)(x, y);

            if (!$_iEvents[1]) {
                createPointerEvent();
            }
            $_iEvents[1].start = date;
            $_iEvents[1].end = addDuration(cloneDate(date), $slotDuration);
            $_iEvents[1].resourceIds = resource ? [resource.id] : [];
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

    function createPointerEvent() {
        $_iEvents[1] = {
            id: '{pointer}',
            title: '',
            display: 'pointer',
            extendedProps: {},
            backgroundColor: 'transparent'
        };
    }

    function removePointerEvent() {
        $_iEvents[1] = null;
    }

    function validEvent(jsEvent) {
        return jsEvent.isPrimary && jsEvent.pointerType === 'mouse';
    }
</script>

<svelte:window
    on:pointermove={handlePointerMove}
    on:scroll={handleScroll}
/>
