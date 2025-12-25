<script>
    import {getContext} from 'svelte';
    import {addDuration, cloneDate, floor, isRtl, rect} from '#lib';
    import {BaseDay} from '#components';

    let {day, noIeb, noBeb} = $props();

    let {options: {slotWidth}} = $derived(getContext('state'));
    let {monthView, snap} = $derived(getContext('view-state'));

    let {dayStart: date, start, resource, disabled, highlight} = $derived(day);

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

<BaseDay bind:el allDay={monthView} {date} {resource} {dateFromPoint} {disabled} {highlight} {noIeb} {noBeb}/>
