<script>
    import {getContext} from 'svelte';
    import {
        cloneDate,
        addDay,
        createEventChunk,
        prepareEventChunks,
        eventIntersects,
        debounce, runReposition
    } from '@event-calendar/core';
    import Day from './Day.svelte';

    export let dates;
    export let resource = undefined;

    let {_events, _iEvents, _queue2, hiddenDays} = getContext('state');

    let chunks, longChunks, iChunks = [];

    let start;
    let end;
    let refs = [];

    $: {
        start = dates[0];
        end = addDay(cloneDate(dates[dates.length - 1]));
    }

    let debounceHandle = {};
    function reposition() {
        debounce(() => runReposition(refs, dates), debounceHandle, _queue2);
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
        // Run reposition only when events get changed
        reposition();
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

{#each dates as date, i}
    <Day {date} {chunks} {longChunks} {iChunks} {resource} bind:this={refs[i]} />
{/each}

<svelte:window on:resize={reposition}/>
