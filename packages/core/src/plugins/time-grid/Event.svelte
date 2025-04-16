<script>
    import {getContext} from 'svelte';
    import {bgEvent, ghostEvent, helperEvent} from '#lib';
    import {InteractableEvent} from '#components';

    let {date, chunk} = $props();

    let {slotEventOverlap, slotDuration, slotHeight, _slotTimeLimits} = getContext('state');

    let display = $derived(chunk.event.display);

    // Style
    let styles = $derived(style => {
        let step = $slotDuration.seconds;
        let offset = $_slotTimeLimits.min.seconds;
        let start = (chunk.start - date) / 1000;
        let end = (chunk.end - date) / 1000;
        let top = (start - offset) / step * $slotHeight;
        let height = (end - start) / step * $slotHeight || $slotHeight;
        let maxHeight = ($_slotTimeLimits.max.seconds - start) / step * $slotHeight;
        style['top'] = `${top}px`;
        style['min-height'] = `${height}px`;
        style['height'] = `${height}px`;
        style['max-height'] = `${maxHeight}px`;
        if (!bgEvent(display) && !helperEvent(display) || ghostEvent(display)) {
            style['z-index'] = `${chunk.column + 1}`;
            style['left'] = `${100 / chunk.group.columns.length * chunk.column}%`;
            style['width'] = `${100 / chunk.group.columns.length * ($slotEventOverlap ? 0.5 * (1 + chunk.group.columns.length - chunk.column) : 1)}%`;
        }
        return style;
    });
</script>

<InteractableEvent {chunk} {styles} axis="y" />
