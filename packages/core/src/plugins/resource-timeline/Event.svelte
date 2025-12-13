<script>
    import {getContext} from 'svelte';
    import {height, helperEvent, toSeconds} from '#lib';
    import {repositionEvent} from './lib.js';
    import {InteractableEvent} from '#components';

    let {chunk} = $props();

    let {slotDuration, slotWidth, _monthView} = getContext('state');

    let el = $state();
    let margin = $state(0);
    let event = $derived(chunk.event);
    // Style
    let styles = $derived(style => {
        style['grid-column'] = `${chunk.gridColumn} / span ${chunk.dates.length}`;
        style['grid-row'] = chunk.gridRow;
        if (!$_monthView) {
            let left = chunk.left / toSeconds($slotDuration) * $slotWidth;
            style['inset-inline-start'] = `${left}px`;
            style['inline-size'] = `${chunk.width / toSeconds($slotDuration) * $slotWidth}px`;
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
        margin = repositionEvent(chunk, height(el), $_monthView);
    }
</script>

<InteractableEvent bind:el {chunk} {styles} axis="x" forceMargin={[margin, chunk.gridRow]} />
