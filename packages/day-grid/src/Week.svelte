<script>
    import {getContext, tick} from 'svelte';
    import {cloneDate, addDay, eventIntersects, bgEvent, createEventChunk, prepareEventChunks,
        runReposition, debounce} from '@event-calendar/core';
    import Day from './Day.svelte';
    
    export let dates;

    let {_events, _iEvents, _queue2, _hiddenEvents,
        resources, hiddenDays, theme,
        _filtered } = getContext('state');

    let chunks, bgChunks, longChunks, iChunks = [];

    let start;
    let end;
    let refs = [];

    $: {
        start = dates[0];
        end = addDay(cloneDate(dates.at(-1)));
    }

    let debounceHandle = {};
    function reposition() {
        debounce(() => runReposition(refs, dates), debounceHandle, _queue2);
    }

    $: {
        chunks = [];
        bgChunks = [];
        for (let event of $_filtered) {
            if (eventIntersects(event, start, end )) {
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
        // Schedule reposition during next update
        tick().then(reposition);
    }
</script>

<div class="{$theme.days}" role="row">
    {#each dates as date, i}
        <Day {date} {chunks} {bgChunks} {longChunks} {iChunks} {dates} bind:this={refs[i]} />
    {/each}
</div>

<svelte:window on:resize={reposition}/>
