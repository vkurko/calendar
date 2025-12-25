<script>
    import {getContext} from 'svelte';
    import {addDuration, cloneDate, getElementWithPayload, getPayload} from '#lib';

    let {iEvents, options: {slotDuration}} = $derived(getContext('state'));

    let x = 0, y = 0;
    let iEvent;

    function move() {
        let dayEl = getElementWithPayload(x, y);

        if (dayEl && !iEvents.has('action')) {
            let {allDay, date, resource, disabled} = getPayload(dayEl)(x, y);
            if (!disabled) {
                if (!iEvent) {
                    createPointerEvent();
                }
                iEvent.allDay = allDay;
                iEvent.start = date;
                iEvent.end = addDuration(cloneDate(date), slotDuration);
                iEvent.resourceIds = resource ? [resource.id] : [];
                iEvents.set('pointer', {...iEvent});

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
        iEvent = {
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
        iEvent = undefined;
        iEvents.delete('pointer');
    }

    function validEvent(jsEvent) {
        return jsEvent.isPrimary && jsEvent.pointerType === 'mouse';
    }
</script>

<svelte:window
    onpointermove={handlePointerMove}
    onscroll={handleScroll}
/>
