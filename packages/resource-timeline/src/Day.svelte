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
    export let longChunks;
    export let iChunks = [];

    let {highlightedDates, slotDuration, slotWidth, theme, _interaction, _today, _dayTimeLimits} = getContext('state');

    let el;
    let dayChunks, bgChunks;
    let isToday, highlight;
    let refs = [];
    let slotTimeLimits;
    let allDay;
    let pointerIdx = 1;

    let start, end;

    $: {
        slotTimeLimits = getSlotTimeLimits($_dayTimeLimits, date);
        start = addDuration(cloneDate(date), slotTimeLimits.min);
        end = addDuration(cloneDate(date), slotTimeLimits.max);
    }

    $: {
        dayChunks = [];
        bgChunks = [];
        for (let chunk of chunks) {
            if (datesEqual(chunk.date, date) && (chunk.start < end && chunk.end > start || chunk.event.allDay)) {
                switch (chunk.event.display) {
                    case 'background': bgChunks.push(chunk); break;
                    default: dayChunks.push(chunk);
                }
            }
        }
    }

    $: isToday = datesEqual(date, $_today);
    $: highlight = $highlightedDates.some(d => datesEqual(d, date));
    $: {
        allDay = !toSeconds($slotDuration);
        pointerIdx = allDay ? 2 : 1;
    }

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
        {#each bgChunks as chunk (chunk.event)}
            <Event {date} {chunk}/>
        {/each}
        <!-- Pointer -->
        {#if iChunks[pointerIdx] && datesEqual(iChunks[pointerIdx].date, date)}
            <Event {date} chunk={iChunks[pointerIdx]}/>
        {/if}
        {#each dayChunks as chunk, i (chunk.event)}
            <Event {date} {chunk} {dayChunks} {longChunks} {resource} bind:this={refs[i]}/>
        {/each}
        <!-- Drag, Resize & Select -->
        {#if iChunks[0] && datesEqual(iChunks[0].date, date)}
            <Event {date} chunk={iChunks[0]} {resource}/>
        {/if}
    </div>
</div>