<script>
    import {getContext} from 'svelte';
    import {bgEvent, helperEvent} from '#lib';
    import {eventResizable} from './lib';

    let {chunk, axis, forceDate = undefined, forceMargin = undefined, children} = $props();

    let {interaction: {action}, options: {editable, eventDurationEditable, eventResizableFromStart, theme}} = $derived(getContext('state'));
    let {snap} = $derived(getContext('view-state'));  // timeGrid has snap, others don't

    let event = $derived(chunk.event);
    let display = $derived(chunk.event.display);

    let resizable = $derived(
        !bgEvent(display) && !helperEvent(display) && eventResizable(event, eventDurationEditable, editable)
    );

    function createResizeHandler(start) {
        return jsEvent => action.resize(
            event,
            jsEvent,
            start,
            axis,
            forceDate,
            forceMargin,
            chunk.zeroDuration,
            snap
        );
    }
</script>

{#if resizable && eventResizableFromStart}
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="{theme.resizer} {theme.start}" onpointerdown={createResizeHandler(true)}></div>
{/if}
{@render children()}
{#if resizable}
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="{theme.resizer}" onpointerdown={createResizeHandler(false)}></div>
{/if}
