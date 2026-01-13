<script>
    import {getContext} from 'svelte';
    import {height, toSeconds} from '#lib';
    import {repositionEvent} from './lib.js';
    import {InteractableEvent} from '#components';

    let {chunk} = $props();

    let {options: {slotDuration, slotWidth}} = $derived(getContext('state'));
    let {monthView} = $derived(getContext('view-state'));

    let el = $state();
    let margin = $state(1);
    let event = $derived(chunk.event);
    // Style
    let styles = $derived(style => {
        style['grid-column'] = `${chunk.gridColumn} / span ${chunk.dates.length}`;
        style['grid-row'] = chunk.gridRow;
        if (!monthView) {
            let left = chunk.left / toSeconds(slotDuration) * slotWidth;
            style['inset-inline-start'] = `${left}px`;
            style['inline-size'] = `${chunk.width / toSeconds(slotDuration) * slotWidth}px`;
        }
        let marginTop = margin;
        if (event._margin) {
            // Force margin for helper events
            let [_margin, _gridRow] = event._margin;
            if (chunk.gridRow === _gridRow) {
                marginTop = _margin;
            }
        }
        style['margin-block-start'] = `${marginTop}px`;
        return style;
    });

    export function reposition() {
        margin = repositionEvent(chunk, height(el), monthView);
    }
</script>

<InteractableEvent bind:el {chunk} {styles} axis="x" forceMargin={[margin, chunk.gridRow]} />
