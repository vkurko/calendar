<script>
    import {getContext} from 'svelte';
    import {toSeconds} from '#lib';
    import {InteractableEvent} from '#components';

    let {chunk} = $props();

    let {options: {slotEventOverlap, slotDuration, slotHeight}} = $derived(getContext('state'));

    // Style
    let styles = $derived(style => {
        let step = toSeconds(slotDuration);
        let top = chunk.top / step * slotHeight;
        let height = chunk.height / step * slotHeight || slotHeight;
        let maxHeight = chunk.maxHeight / step * slotHeight;
        style['grid-column'] = chunk.gridColumn;
        style['inset-block-start'] = `${top}px`;
        style['min-block-size'] = `${height}px`;
        style['block-size'] = `${height}px`;
        style['max-block-size'] = `${maxHeight}px`;
        let maxWidth = '100% - var(--ec-event-col-gap)';
        if (chunk.group) {
            let groupColumns = chunk.group.columns.length;
            style['z-index'] = `${chunk.groupColumn + 1}`;
            style['inset-inline-start'] = `calc((${maxWidth}) / ${groupColumns} * ${chunk.groupColumn})`;
            style['inline-size'] = `calc((${maxWidth}) / ${groupColumns} * ${(slotEventOverlap ? 0.5 * (1 + groupColumns - chunk.groupColumn) : 1)})`;
        }
        return style;
    });
</script>

<InteractableEvent {chunk} {styles} axis="y" />
