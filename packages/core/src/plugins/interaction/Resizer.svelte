<script>
    import {getContext} from 'svelte';
    import {bgEvent, helperEvent} from '#lib';
    import {eventResizable} from './lib';

    let {chunk, axis, forceDate = undefined, forceMargin = undefined, children} = $props();

    let {theme, eventDurationEditable, eventResizableFromStart, editable, _interaction} = getContext('state');

    let event = $derived(chunk.event);
    let display = $derived(chunk.event.display);

    let resizable = $derived(
        !bgEvent(display) && !helperEvent(display) && eventResizable(event, $eventDurationEditable, $editable)
    );

    function createResizeHandler(start) {
        return jsEvent => $_interaction.action.resize(
            event,
            jsEvent,
            start,
            axis,
            forceDate?.(),
            forceMargin?.(),
            chunk.zeroDuration
        );
    }
</script>

{#if resizable && $eventResizableFromStart}
    <div class="{$theme.resizer} {$theme.start}" onpointerdown={createResizeHandler(true)}></div>
{/if}
{@render children()}
{#if resizable}
    <div class="{$theme.resizer}" onpointerdown={createResizeHandler(false)}></div>
{/if}
