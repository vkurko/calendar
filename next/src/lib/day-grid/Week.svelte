<script>
    import {getContext, tick} from 'svelte';
    import {
        addDay, bgEvent, cloneDate, createEventChunk, debounce, eventIntersects, limitToRange, prepareEventChunks,
        runReposition
    } from '$lib/core';
    import Day from './Day.svelte';

    let {dates} = $props();

    let {_events, _iEvents, _queue2, _hiddenEvents,
        resources, filterEventsWithResources, hiddenDays, theme, validRange} = getContext('state');

    let refs = [];

    let start = $derived(limitToRange(dates[0], $validRange));
    let end = $derived(addDay(cloneDate(limitToRange(dates.at(-1), $validRange))));

    let debounceHandle = {};
    function reposition() {
        debounce(() => runReposition(refs, dates), debounceHandle, _queue2);
    }

    $effect(() => {
        // Run reposition only when events get changed
        runReposition(refs, dates);
    });

    let [chunks, bgChunks, longChunks] = $derived.by(() => {
        let chunks = [];
        let bgChunks = [];
        for (let event of $_events) {
            if (eventIntersects(event, start, end, $filterEventsWithResources ? $resources : undefined)) {
                let chunk = createEventChunk(event, start, end);
                if (bgEvent(event.display)) {
                    if (event.allDay) {
                        bgChunks.push(chunk);
                    }
                } else {
                    chunks.push(chunk);
                }
            }
        }
        prepareEventChunks(bgChunks, $hiddenDays);
        let longChunks = prepareEventChunks(chunks, $hiddenDays);
        // // Run reposition only when events get changed
        // reposition();

        return [chunks, bgChunks, longChunks];
    });

    let iChunks = $derived($_iEvents.map(event => {
        let chunk;
        if (event && eventIntersects(event, start, end)) {
            chunk = createEventChunk(event, start, end);
            prepareEventChunks([chunk], $hiddenDays);
        } else {
            chunk = null;
        }
        return chunk;
    }));

    $effect(() => {
        if ($_hiddenEvents) {
            // Schedule reposition during next update
            tick().then(reposition);
        }
    });
</script>

<div class="{$theme.days}" role="row">
    {#each dates as date, i}
        <!-- svelte-ignore binding_property_non_reactive -->
        <Day {date} {chunks} {bgChunks} {longChunks} {iChunks} {dates} bind:this={refs[i]} />
    {/each}
</div>

<svelte:window on:resize={reposition}/>
