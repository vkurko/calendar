<script>
    import {getContext} from 'svelte';
    import {cloneDate, addDay, createEventChunk, prepareEventChunks, eventIntersects} from '@event-calendar/core';
    import Day from './Day.svelte';

    export let dates;
    export let resource = undefined;

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
            if (event.allDay && event.display !== 'background' && eventIntersects(event, start, end, resource)) {
                let chunk = createEventChunk(event, start, end);
                chunks.push(chunk);
            }
        }
        longChunks = prepareEventChunks(chunks, $hiddenDays);
    }

    $: iChunks = $_iEvents.map(event => {
        let chunk;
        if (event && event.allDay && eventIntersects(event, start, end, resource)) {
            chunk = createEventChunk(event, start, end);
            prepareEventChunks([chunk], $hiddenDays);
        } else {
            chunk = null;
        }
        return chunk;
    });
</script>

{#each dates as date}
    <Day {date} {chunks} {longChunks} {iChunks} {resource}/>
{/each}
