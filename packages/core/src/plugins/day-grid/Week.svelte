<script>
    import {getContext} from 'svelte';
    import {
        addDay, bgEvent, cloneDate, createEventChunk, eventIntersects, limitToRange, prepareEventChunks,
        runReposition
    } from '#lib';
    import Day from './Day.svelte';

    let {dates} = $props();

    let {_filtered, _iEvents,
        resources, filterEventsWithResources, hiddenDays, theme, validRange } = getContext('state');

    let refs = [];

    let start = $derived(limitToRange(dates[0], $validRange));
    let end = $derived(addDay(cloneDate(limitToRange(dates.at(-1), $validRange))));

    let [chunks, bgChunks, longChunks] = $derived.by(() => {
        let chunks = [];
        let bgChunks = [];
        for (let event of $_filtered) {
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

    export function reposition() {
        runReposition(refs, dates);
    }
</script>

<div class="{$theme.days}" role="row">
    {#each dates as date, i}
        <!-- svelte-ignore binding_property_non_reactive -->
        <Day {date} {chunks} {bgChunks} {longChunks} {iChunks} {dates} bind:this={refs[i]} />
    {/each}
</div>
