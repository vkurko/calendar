<script>
    import {getContext} from 'svelte';
    import {cloneDate, addDay, eventIntersects, bgEvent, createEventChunk, prepareEventChunks,
        runReposition, debounce} from '@event-calendar/core';
    import Day from './Day.svelte';

    export let dates;

    let {_events, _iEvents, _queue2, _hiddenEvents, hiddenDays, theme} = getContext('state');

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
            if (!bgEvent(event.display) && eventIntersects(event, start, end)) {
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
        if (event && eventIntersects(event, start, end)) {
            chunk = createEventChunk(event, start, end);
            prepareEventChunks([chunk], $hiddenDays);
        } else {
            chunk = null;
        }
        return chunk;
    });

    $: if ($_hiddenEvents) {
        reposition();
    }
</script>

<div class="{$theme.days}" role="row">
    {#each dates as date, i}
        <Day {date} {chunks} {longChunks} {iChunks} bind:this={refs[i]} />
    {/each}
</div>

<svelte:window on:resize={reposition}/>
