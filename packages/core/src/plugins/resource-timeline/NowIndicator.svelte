<script>
    import {getContext} from 'svelte';
    import {addDuration, cloneDate, datesEqual} from '#lib';
    import {getSlotTimeLimits} from './lib.js';

    let {slotDuration, slotWidth, theme, _bodyHeight, _bodyWidth, _bodyScrollLeft,
        _headerHeight, _dayTimeLimits, _now, _today, _viewDates} = getContext('state');

    // Style
    let left = $derived.by(() => {
        let offset = 0;
        for (let i = 0; i < $_viewDates.length; ++i) {
            let slotTimeLimits = getSlotTimeLimits($_dayTimeLimits, $_viewDates[i]);
            if (datesEqual($_viewDates[i], $_today)) {
                let dayStart = addDuration(cloneDate($_viewDates[i]), slotTimeLimits.min);
                let dayEnd = addDuration(cloneDate($_viewDates[i]), slotTimeLimits.max);
                if ($_now >= dayStart && $_now <= dayEnd) {
                    offset += ($_now - dayStart) / 1000;
                    break;
                } else {
                    return null;
                }
            } else {
                offset += slotTimeLimits.max.seconds - slotTimeLimits.min.seconds;
            }
        }
        let step = $slotDuration.seconds;
        return offset / step * $slotWidth - $_bodyScrollLeft;
    });
</script>

{#if left !== null && left >= 3 && left <= $_bodyWidth - 3}
    <div
        class="{$theme.nowIndicator}"
        style:top="{$_headerHeight+2}px"
        style:left="{left}px"
        style:height="{$_bodyHeight-1}px"
    ></div>
{/if}
