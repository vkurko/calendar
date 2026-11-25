<script>
    import {getContext} from 'svelte';
    import {height, repositionEvent} from '#lib';
    import {InteractableEvent} from '#components';

    let {chunk} = $props();

    let {options: {eventGap}} = $derived(getContext('state'));

    // Not a state: the element is not used reactively, and a state written by each component slows down the rendering
    // svelte-ignore non_reactive_update
    let el;
    let margin = $state(0);
    let event = $derived(chunk.event);

    // Style
    let styles = $derived(style => {
        style['grid-column'] = `${chunk.gridColumn} / span ${chunk.dates.length}`;
        if (margin || event._margin) {
            style['margin-block-start'] = `${event._margin ?? margin}px`;
        }
        return style;
    });

    export function reposition() {
        margin = repositionEvent(chunk, height(el), 1, eventGap);
    }
</script>

<InteractableEvent
    bind:el
    {chunk}
    {styles}
    axis="x"
    forceMargin={margin}
/>
