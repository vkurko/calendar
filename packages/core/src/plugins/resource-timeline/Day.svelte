<script>
    import {getContext} from 'svelte';
    import {addDuration, cloneDate, floor, isRtl, rect, toTime} from '#lib';
    import {BaseDay} from '#components';
    import SlotLines from '../time-grid/SlotLines.svelte';

    let {day, resourceFromPoint, noIeb} = $props();

    let {options: {slotWidth}} = $derived(getContext('state'));
    let {daySlots, monthView, snap} = $derived(getContext('view-state'));

    let {dayStart: date, start, disabled, highlight} = $derived(day);

    // Not a state: the element is not used reactively, and a state written by each component slows down the rendering
    // svelte-ignore non_reactive_update
    let el;

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
    {#snippet content()}
        {#if !monthView}
            <SlotLines slots={daySlots[toTime(date)]}/>
        {/if}
    {/snippet}
</BaseDay>
