<script>
    import {getContext} from 'svelte';

    let {slotDuration, slotHeight, theme, _now, _today} = getContext('state');

    let {_slotTimeLimits} = getContext('view-state');

    let start;
    let top = 0;

    $: start = ($_now - $_today) / 1000 / 60;
    $: {
        // Style
        let step = $slotDuration.seconds / 60;
        let offset = $_slotTimeLimits.min.seconds / 60;
        top = (start - offset) / step * $slotHeight;
    }
</script>

<div
    class="{$theme.nowIndicator}"
    style="top:{top}px"
></div>