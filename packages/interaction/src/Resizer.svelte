<script>
    import {getContext} from 'svelte';
    import {bgEvent, helperEvent} from '@event-calendar/core';

    export let event;

    let {theme, eventDurationEditable, editable} = getContext('state');

    let resizable;
    $: resizable = !bgEvent(event.display) &&
        !helperEvent(event.display) && (
            (event.durationEditable ?? $eventDurationEditable) ||
            (event.editable ?? $editable)
        )
</script>

{#if resizable}
    <div
        class="{$theme.resizer}"
        on:pointerdown
    ></div>
{/if}