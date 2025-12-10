<script>
    import {getContext} from 'svelte';
    import {addDuration, cloneDate, floor, rect} from '#lib';
    import {BaseDay} from '#components';

    let {day} = $props();

    let {_monthView, slotDuration, slotWidth} = getContext('state');

    let {dayStart: date, start, resource, disabled, highlight} = $derived(day);

    let el = $state();

    function dateFromPoint(x, y) {
        return $_monthView
            ? date
            : addDuration(cloneDate(start), $slotDuration, floor((x - rect(el).left)/ $slotWidth));
    }
</script>

<BaseDay bind:el allDay={$_monthView} {date} {resource} {dateFromPoint} {disabled} {highlight}/>
