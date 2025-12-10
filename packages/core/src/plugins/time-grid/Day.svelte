<script>
    import {getContext} from 'svelte';
    import {addDuration, cloneDate, floor, rect} from '#lib';
    import {BaseDay} from '#components';

    let {day, allDay = false} = $props();

    let {slotDuration, slotHeight} = getContext('state');

    let {dayStart: date, start, resource, disabled, highlight} = $derived(day);

    let el = $state();

    function dateFromPoint(x, y) {
        return allDay
            ? date
            : addDuration(cloneDate(start), $slotDuration, floor((y - rect(el).top) / $slotHeight));
    }
</script>

<BaseDay bind:el {date} {allDay} {resource} {dateFromPoint} {disabled} {highlight}/>
