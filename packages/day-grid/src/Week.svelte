<script>
    import {getContext} from 'svelte';
    import {cloneDate, addDay, eventIntersects, bgEvent, createEventChunk, prepareEventChunks} from '@event-calendar/core';
    import Day from './Day.svelte';

    export let dates;

    let {_events, _iEvents, hiddenDays, theme} = getContext('state');

    let chunks, longChunks, iChunks = [];

    let start;
    let end;

    $: {
        start = dates[0];
        end = addDay(cloneDate(dates[dates.length - 1]));
    }

    $: {
        chunks = [];
        for (let event of $_events) {
            if (!bgEvent(event.display) && eventIntersects(event, start, end)) {
                let chunk = createEventChunk(event, start, end);
                chunks.push(chunk);
            }
        }
        longChunks = prepareEventChunks(chunks, $hiddenDays);
    }

    $: iChunks = $_iEvents.map(event => {
        let chunk;
        if (event && eventIntersects(event, start, end)) {
            chunk = createEventChunk(event, start, end);
            prepareEventChunks([chunk], $hiddenDays);
        } else {
            chunk = null;
        }
        return chunk;
    });
</script>

<div class="{$theme.days}">
    {#each dates as date}
        <Day {date} {chunks} {longChunks} {iChunks} />
    {/each}
</div>