<script>
    import {getContext} from 'svelte';
    import {
        addDay, addDuration, bgEvent, ceil, cloneDate, createEventChunk, DAY_IN_SECONDS, eventIntersects,
        getPayload, limitToRange, max, runReposition
    } from '#lib';
    import {getSlotTimeLimits, prepareEventChunks} from './lib.js';
    import Day from './Day.svelte';

    let {resource} = $props();

    let {
        _viewDates, _filteredEvents, _iEvents, _resHs, _dayTimeLimits, slotDuration, theme, validRange
    } = getContext('state');

    let refs = [];
    let height = $state(0);

    let [start, end] = $derived.by(() => {
        let start = cloneDate(limitToRange($_viewDates[0], $validRange));
        let end = cloneDate(limitToRange($_viewDates.at(-1), $validRange));
        let slotTimeLimits = getSlotTimeLimits($_dayTimeLimits, start);
        addDuration(start, slotTimeLimits.min);
        slotTimeLimits = getSlotTimeLimits($_dayTimeLimits, end);
        if (slotTimeLimits.max.seconds > DAY_IN_SECONDS) {
            addDuration(end, slotTimeLimits.max)  /** @see https://github.com/vkurko/calendar/issues/333 */
        } else {
            addDay(end);
        }
        return [start, end];
    });

    let [chunks, bgChunks, longChunks] = $derived.by(() => {
        let chunks = [];
        let bgChunks = [];
        let longChunks;
        for (let event of $_filteredEvents) {
            if (eventIntersects(event, start, end, resource)) {
                let chunk = createEventChunk(event, start, end);
                if (bgEvent(event.display)) {
                    bgChunks.push(chunk);
                } else {
                    chunks.push(chunk);
                }
            }
        }
        [bgChunks] = prepareEventChunks(bgChunks, $_viewDates, $_dayTimeLimits, $slotDuration);
        [chunks, longChunks] = prepareEventChunks(chunks, $_viewDates, $_dayTimeLimits, $slotDuration);
        return [chunks, bgChunks, longChunks];
    });

    let iChunks = $derived($_iEvents.map(event => {
        let chunk;
        if (event && eventIntersects(event, start, end, resource)) {
            chunk = createEventChunk(event, start, end);
            [[chunk]] = prepareEventChunks([chunk], $_viewDates, $_dayTimeLimits, $slotDuration);
        } else {
            chunk = null;
        }
        return chunk;
    }));

    export function reposition() {
        let payload = getPayload(resource);
        let resourceLabelHeight = ceil(payload.height ?? 0);
        let daysRowHeight = ceil(max(...runReposition(refs, $_viewDates)));
        height = max(resourceLabelHeight, daysRowHeight) + 10;
        $_resHs.set(resource, height);
        $_resHs = $_resHs;
    }
</script>

<div class="{$theme.days}" style="flex-basis: {max(height, 34)}px" role="row">
    {#each $_viewDates as date, i}
        <!-- svelte-ignore binding_property_non_reactive -->
        <Day {date} {resource} {chunks} {bgChunks} {longChunks} {iChunks} bind:this={refs[i]}/>
    {/each}
</div>
