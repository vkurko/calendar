<script>
    import {getContext} from 'svelte';

    let {slotDuration, slotHeight, theme, _now, _today, _slotTimeLimits} = getContext('state');

    let start = $derived(($_now - $_today) / 1000);
    // Style
    let top = $derived.by(() => {
        let step = $slotDuration.seconds;
        let offset = $_slotTimeLimits.min.seconds;
        return (start - offset) / step * $slotHeight;
    });
</script>

<div
    class="{$theme.nowIndicator}"
    style="top:{top}px"
></div>
