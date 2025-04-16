<script>
    import {getContext} from 'svelte';
    import {height, helperEvent, toSeconds} from '#lib';
    import {repositionEvent} from './lib.js';
    import {InteractableEvent} from '#components';

    let {chunk, dayChunks = [], longChunks = {}, resource = undefined} = $props();

    let {slotDuration, slotWidth} = getContext('state');

    let el = $state();
    let margin = $state(helperEvent(chunk.event.display) ? 1 : 0);
    let event = $derived(chunk.event);
    // Style
    let width = $derived('slots' in chunk ? chunk.slots * $slotWidth : chunk.days * 100);
    let styles = $derived(style => {
        if ('slots' in chunk) {
            let left = chunk.offset * $slotWidth;
            style['left'] = `${left}px`;
            style['width'] = `${width}px`;
        } else {
            // Month view
            style['width'] = `${width}%`;
        }
        let marginTop = margin;
        if (event._margin) {
            // Force margin for helper events
            let [_margin, _resource] = event._margin;
            if (resource === _resource) {
                marginTop = _margin;
            }
        }
        style['margin-top'] = `${marginTop}px`;
        return style;
    });

    export function reposition() {
        if (!el) {
            return 0;
        }
        let h = height(el);
        margin = repositionEvent(chunk, dayChunks, longChunks, h, !toSeconds($slotDuration));
        return margin + h;
    }
</script>

{#if width > 0}
    <InteractableEvent bind:el {chunk} {styles} axis="x" forceMargin={() => [margin, resource]} />
{/if}
