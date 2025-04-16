<script>
    import {ancestor, bgEvent, height, rect, repositionEvent} from '#lib';
    import {InteractableEvent} from '#components';

    let {chunk, longChunks = {}} = $props();

    let el = $state();
    let margin = $state(1);
    let event = $derived(chunk.event);
    let display = $derived(chunk.event.display);

    // Style
    let styles = $derived(style => {
        if (bgEvent(display)) {
            style['width'] = `calc(${chunk.days * 100}% + ${(chunk.days - 1)}px)`;
        } else {
            style['width'] = `calc(${chunk.days * 100}% + ${(chunk.days - 1) * 7}px)`;
            style['margin-top'] = `${event._margin ?? margin}px`;
        }
        return style;
    });

    export function reposition() {
        if (!el) {
            return;
        }
        margin = repositionEvent(chunk, longChunks, height(el));
    }
</script>

<InteractableEvent
    bind:el
    {chunk}
    {styles}
    axis="x"
    forceMargin={() => rect(el).top - rect(ancestor(el, 1)).top}
/>
