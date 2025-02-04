<script>
    import {getContext} from 'svelte';
    import {
        addDay, bgEvent, cloneDate, createEventChunk, debounce, eventIntersects, limitToRange, prepareEventChunks,
        runReposition
    } from '@event-calendar/core';
    import Day from './Day.svelte';

    export let dates;
    export let resource = undefined;

    let {_events, _iEvents, _queue2, hiddenDays, resources, filterEventsWithResources, validRange} = getContext('state');

    let chunks, bgChunks, longChunks, iChunks = [];

    let start;
    let end;
    let refs = [];
    let resourceFilter;

    $: {
        start = limitToRange(dates[0], $validRange);
        end = addDay(cloneDate(limitToRange(dates.at(-1), $validRange)));
    }

    $: resourceFilter = resource ?? (
        $filterEventsWithResources ? $resources : undefined
    );

    let debounceHandle = {};
    function reposition() {
        debounce(() => runReposition(refs, dates), debounceHandle, _queue2);
    }

    $: {
        chunks = [];
        bgChunks = [];
        for (let event of $_events) {
            if (event.allDay && eventIntersects(event, start, end, resourceFilter)) {
                let chunk = createEventChunk(event, start, end);
                if (bgEvent(event.display)) {
                    bgChunks.push(chunk);
                } else {
                    chunks.push(chunk);
                }
            }
        }
        prepareEventChunks(bgChunks, $hiddenDays);
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
    <Day {date} {chunks} {bgChunks} {longChunks} {iChunks} {resource} bind:this={refs[i]} />
{/each}

<svelte:window on:resize={reposition}/>
