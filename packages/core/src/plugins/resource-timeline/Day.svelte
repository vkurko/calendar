<script>
    import {getContext} from 'svelte';
    import {addDuration, cloneDate, floor, isRtl, rect} from '#lib';
    import {BaseDay} from '#components';

    let {day, noIeb, noBeb} = $props();

    let {_monthView, slotDuration, slotWidth} = getContext('state');

    let {dayStart: date, start, resource, disabled, highlight} = $derived(day);

    let el = $state();

    function dateFromPoint(x, y) {
        if ($_monthView) {
            return date;
        } else {
            let dayRect = rect(el);
            let scaleX = dayRect.width / el.offsetWidth;
            return addDuration(cloneDate(start), $slotDuration, floor((isRtl() ? dayRect.right - x : x - dayRect.left) / ($slotWidth * scaleX)));
        }
    }
</script>

<BaseDay bind:el allDay={$_monthView} {date} {resource} {dateFromPoint} {disabled} {highlight} {noIeb} {noBeb}/>
