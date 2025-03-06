<script>
    import {getContext} from 'svelte';

    let {slotDuration, slotHeight, theme, _now, _today, _slotTimeLimits} = getContext('state');

    let start = $derived(($_now - $_today) / 1000 / 60);
    // Style
    let top = $derived.by(() => {
        let step = $slotDuration.seconds / 60;
        let offset = $_slotTimeLimits.min.seconds / 60;
        return (start - offset) / step * $slotHeight;
    });
</script>

<div
    class="{$theme.nowIndicator}"
    style="top:{top}px"
></div>
