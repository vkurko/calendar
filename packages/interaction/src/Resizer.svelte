<script>
    import {getContext} from 'svelte';
    import {bgEvent, helperEvent} from '@event-calendar/core';

    export let event;
    export let start = false;

    let {theme, eventDurationEditable, eventResizableFromStart, editable} = getContext('state');

    let resizable;
    $: resizable = !bgEvent(event.display) &&
        !helperEvent(event.display) &&
        (!start || $eventResizableFromStart) && (
            (event.durationEditable ?? $eventDurationEditable) ||
            (event.editable ?? $editable)
        )
</script>

{#if resizable}
    <div
        class="{$theme.resizer}{start ? ' ' + $theme.start : ''}"
        on:pointerdown
    ></div>
{/if}