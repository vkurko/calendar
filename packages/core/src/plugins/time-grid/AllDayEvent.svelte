<script>
    import {height, repositionEvent} from '#lib';
    import {InteractableEvent} from '#components';

    let {chunk} = $props();

    let el = $state();
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
        margin = repositionEvent(chunk, height(el));
    }
</script>

<InteractableEvent
    bind:el
    {chunk}
    {styles}
    axis="x"
    forceMargin={margin}
/>
