<script>
    import {getContext} from 'svelte';
    import {
        cloneDate, addDay, eventIntersects, createEventChunk,
        runReposition, debounce, max, ceil, bgEvent, DAY_IN_SECONDS, addDuration, handleZeroDurationChunk
    } from '@event-calendar/core';
    import {getSlotTimeLimits, prepareEventChunks} from './lib.js';
    import Day from './Day.svelte';

    export let resource;

    let {_viewDates, _events, _iEvents, _queue2, _resHs, _dayTimeLimits, slotDuration, theme} = getContext('state');

    let chunks, bgChunks, longChunks, iChunks = [];

    let start;
    let end;
    let refs = [];
    let height = 0;

    $: {
        start = $_viewDates[0];
        let slotTimeLimits = getSlotTimeLimits($_dayTimeLimits, $_viewDates.at(-1));
        end = slotTimeLimits.max.seconds > DAY_IN_SECONDS
            ? addDuration(cloneDate($_viewDates.at(-1)), slotTimeLimits.max)  /** @see https://github.com/vkurko/calendar/issues/333 */
            : addDay(cloneDate($_viewDates.at(-1)));
    }

    let debounceHandle = {};
    function reposition() {
        debounce(() => {
            height = ceil(max(...runReposition(refs, $_viewDates))) + 10;
            $_resHs.set(resource, height);
            $_resHs = $_resHs;
        }, debounceHandle, _queue2);
    }

    $: {
        chunks = [];
        bgChunks = [];
        for (let event of $_events) {
            if (eventIntersects(event, start, end, resource)) {
                let chunk = createEventChunk(event, start, end);
                handleZeroDurationChunk(chunk, $slotDuration);
                if (bgEvent(event.display)) {
                    bgChunks.push(chunk);
                } else {
                    chunks.push(chunk);
                }
            }
        }
        prepareEventChunks(bgChunks, $_viewDates, $_dayTimeLimits, $slotDuration);
        longChunks = prepareEventChunks(chunks, $_viewDates, $_dayTimeLimits, $slotDuration);
        // Run reposition only when events get changed
        reposition();
    }

    $: iChunks = $_iEvents.map(event => {
        let chunk;
        if (event && eventIntersects(event, start, end, resource)) {
            chunk = createEventChunk(event, start, end);
            prepareEventChunks([chunk], $_viewDates, $_dayTimeLimits, $slotDuration);
        } else {
            chunk = null;
        }
        return chunk;
    });
</script>

<div class="{$theme.days}" style="flex-basis: {max(height, 34)}px" role="row">
    {#each $_viewDates as date, i}
        <Day {date} {resource} {chunks} {bgChunks} {longChunks} {iChunks} bind:this={refs[i]}/>
    {/each}
</div>

<svelte:window on:resize={reposition}/>
