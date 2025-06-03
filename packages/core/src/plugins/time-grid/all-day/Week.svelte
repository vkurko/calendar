<script>
    import {getContext, untrack} from 'svelte';
    import {
        addDay, bgEvent, cloneDate, createEventChunk, eventIntersects, limitToRange, prepareEventChunks, runReposition
    } from '../../../lib';
    import Day from './Day.svelte';

    let {dates, resource = undefined} = $props();

    let {_filteredEvents, _iEvents, hiddenDays, resources, filterEventsWithResources, validRange } = getContext('state');

    let refs = [];

    let start = $derived(limitToRange(dates[0], $validRange));
    let end = $derived(addDay(cloneDate(limitToRange(dates.at(-1), $validRange))));

    let resourceFilter = $derived(resource ?? (
        $filterEventsWithResources ? $resources : undefined
    ));

    let [chunks, bgChunks, longChunks] = $derived.by(() => {
        let chunks = [];
        let bgChunks = [];
        for (let event of $_filteredEvents) {
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
        let longChunks = prepareEventChunks(chunks, $hiddenDays);
        return [chunks, bgChunks, longChunks];
    });

    function reposition() {
        runReposition(refs, dates);
    }
    $effect(() => {
        chunks;
        untrack(reposition);
    });

    let iChunks = $derived($_iEvents.map(event => {
        let chunk;
        if (event && event.allDay && eventIntersects(event, start, end, resource)) {
            chunk = createEventChunk(event, start, end);
            prepareEventChunks([chunk], $hiddenDays);
        } else {
            chunk = null;
        }
        return chunk;
    }));
</script>

{#each dates as date, i}
    <!-- svelte-ignore binding_property_non_reactive -->
    <Day {date} {chunks} {bgChunks} {longChunks} {iChunks} {resource} bind:this={refs[i]} />
{/each}

<svelte:window on:resize={reposition}/>
