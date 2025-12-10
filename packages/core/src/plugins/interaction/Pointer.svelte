<script>
    import {getContext} from 'svelte';
    import {addDuration, cloneDate, getElementWithPayload, getPayload} from '#lib';

    let {_iEvents, slotDuration} = getContext('state');

    let x = 0, y = 0;

    $effect(() => {
        if ($_iEvents[0]) {
            removePointerEvent();
        }
    });

    function move() {
        let dayEl = getElementWithPayload(x, y);

        if (dayEl) {
            let {allDay, date, resource, disabled} = getPayload(dayEl)(x, y);
            if (!disabled) {
                if (!$_iEvents[1]) {
                    createPointerEvent();
                }
                $_iEvents[1].allDay = allDay;
                $_iEvents[1].start = date;
                $_iEvents[1].end = addDuration(cloneDate(date), $slotDuration);
                $_iEvents[1].resourceIds = resource ? [resource.id] : [];

                return;
            }
        }

        removePointerEvent();
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
            backgroundColor: 'transparent',
            classNames: [],
            styles: []
        };
    }

    function removePointerEvent() {
        if ($_iEvents[1]) {
            $_iEvents[1] = null;
        }
    }

    function validEvent(jsEvent) {
        return jsEvent.isPrimary && jsEvent.pointerType === 'mouse';
    }
</script>

<svelte:window
    onpointermove={handlePointerMove}
    onscroll={handleScroll}
/>
