<script>
    import {getContext} from 'svelte';
    import {
        cloneDate,
        addDuration,
        datesEqual,
        max,
        floor,
        ceil,
        rect,
        setPayload,
        toSeconds,
        runReposition
    } from '@event-calendar/core';
    import {getSlotTimeLimits} from './lib.js';
    import Event from './Event.svelte';

    export let date;
    export let resource;
    export let chunks;
    export let bgChunks;
    export let longChunks;
    export let iChunks = [];

    let {highlightedDates, slotDuration, slotWidth, theme, _interaction, _today, _dayTimeLimits} = getContext('state');

    let el;
    let dayChunks, dayBgChunks;
    let isToday, highlight;
    let refs = [];
    let slotTimeLimits;
    let allDay;
    let pointerIdx = 1;


    $: slotTimeLimits = getSlotTimeLimits($_dayTimeLimits, date);
    $: {
        allDay = !toSeconds($slotDuration);
        pointerIdx = allDay ? 2 : 1;
    }

    $: dayChunks = chunks.filter(chunkIntersects);
    $: dayBgChunks = bgChunks.filter(bgChunk => (!allDay || bgChunk.event.allDay) && chunkIntersects(bgChunk));

    function chunkIntersects(chunk) {
        return datesEqual(chunk.date, date);
    }

    $: isToday = datesEqual(date, $_today);
    $: highlight = $highlightedDates.some(d => datesEqual(d, date));

    function dateFromPoint(x, y) {
        x -= rect(el).left;
        return {
            allDay,
            date: allDay
                ? cloneDate(date)
                : addDuration(
                    addDuration(cloneDate(date), slotTimeLimits.min),
                    $slotDuration,
                    floor(x / $slotWidth)
                ),
            resource,
            dayEl: el
        };
    }

    $: if (el) {
        setPayload(el, dateFromPoint);
    }

    export function reposition() {
        return max(...runReposition(refs, dayChunks));
    }
</script>

<div
    bind:this={el}
    class="{$theme.day} {$theme.weekdays?.[date.getUTCDay()]}{isToday ? ' ' + $theme.today : ''}{highlight ? ' ' + $theme.highlight : ''}"
    style="flex-grow: {allDay ? null : ceil((toSeconds(slotTimeLimits.max) - toSeconds(slotTimeLimits.min)) / toSeconds($slotDuration))}"
    role="cell"
    on:pointerleave={$_interaction.pointer?.leave}
    on:pointerdown={$_interaction.action?.select}
>
    <div class="{$theme.events}">
        {#each dayBgChunks as chunk (chunk.event)}
            <Event {chunk}/>
        {/each}
        <!-- Pointer -->
        {#if iChunks[pointerIdx] && chunkIntersects(iChunks[pointerIdx])}
            <Event chunk={iChunks[pointerIdx]}/>
        {/if}
        {#each dayChunks as chunk, i (chunk.event)}
            <Event {chunk} {dayChunks} {longChunks} {resource} bind:this={refs[i]}/>
        {/each}
        <!-- Drag, Resize & Select -->
        {#if iChunks[0] && chunkIntersects(iChunks[0])}
            <Event chunk={iChunks[0]} {resource}/>
        {/if}
    </div>
</div>