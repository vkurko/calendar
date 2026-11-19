<script>
    import {getContext} from 'svelte';
    import {addDuration, cloneDate, contentFrom, floor, isRtl, rect, toTime} from '#lib';
    import {BaseDay} from '#components';
    import SlotLines from '../time-grid/SlotLines.svelte';

    let {day, resourceFromPoint, noIeb} = $props();

    let {options: {slotWidth}} = $derived(getContext('state'));
    let {daySlots, monthView, snap} = $derived(getContext('view-state'));

    let {dayStart: date, start, disabled, highlight} = $derived(day);

    let el = $state();

    function dateFromPoint(x, y) {
        if (monthView) {
            return date;
        } else {
            let dayRect = rect(el);
            let scaleX = dayRect.width / el.offsetWidth;
            return addDuration(
                cloneDate(start),
                snap.duration,
                floor((isRtl() ? dayRect.right - x : x - dayRect.left) / (slotWidth * snap.ratio * scaleX))
            );
        }
    }
</script>

<BaseDay bind:el allDay={monthView} {date} {dateFromPoint} {resourceFromPoint} {disabled} {highlight} {noIeb}>
    {#snippet content(dayCell)}
        {#if !monthView}
            <SlotLines slots={daySlots[toTime(date)]}/>
        {/if}
        <div
            {@attach contentFrom(dayCell.content, dayCell.snippet)}
        >{@render dayCell.snippet?.(dayCell.arg)}</div>
    {/snippet}
</BaseDay>
