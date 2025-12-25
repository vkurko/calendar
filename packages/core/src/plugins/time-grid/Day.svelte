<script>
    import {getContext} from 'svelte';
    import {addDuration, cloneDate, floor, rect} from '#lib';
    import {BaseDay} from '#components';

    let {day, allDay = false, noIeb, noBeb} = $props();

    let {options: {slotHeight}} = $derived(getContext('state'));
    let {snap} = $derived(getContext('view-state'));

    let {dayStart: date, start, resource, disabled, highlight} = $derived(day);

    let el = $state();

    function dateFromPoint(x, y) {
        if (allDay) {
            return date;
        } else {
            let dayRect = rect(el);
            let scaleY = dayRect.height / el.offsetHeight;
            return addDuration(
                cloneDate(start),
                snap.duration,
                floor((y - dayRect.top) / (slotHeight * snap.ratio * scaleY))
            );
        }
    }
</script>

<BaseDay bind:el {date} {allDay} {resource} {dateFromPoint} {disabled} {highlight} {noIeb} {noBeb}/>
