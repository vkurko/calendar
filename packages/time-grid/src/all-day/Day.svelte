<script>
    import {getContext} from 'svelte';
    import {datesEqual, runReposition, setPayload} from '@event-calendar/core';
    import Event from './Event.svelte';

    export let date;
    export let chunks;
    export let longChunks;
    export let iChunks = [];
    export let resource = undefined;

    let {highlightedDates, theme, _interaction, _today} = getContext('state');

    let el;
    let dayChunks;
    let isToday;
    let highlight;
    let refs = [];

    $: {
        dayChunks = [];
        for (let chunk of chunks) {
            if (datesEqual(chunk.date, date)) {
                dayChunks.push(chunk);
            }
        }
    }

    $: isToday = datesEqual(date, $_today);
    $: highlight = $highlightedDates.some(d => datesEqual(d, date));

    // dateFromPoint
    $: if (el) {
        setPayload(el, () => ({allDay: true, date, resource, dayEl: el}));
    }

    export function reposition() {
        runReposition(refs, dayChunks);
    }
</script>

<div
    bind:this={el}
    class="{$theme.day} {$theme.weekdays?.[date.getUTCDay()]}{isToday ? ' ' + $theme.today : ''}{highlight ? ' ' + $theme.highlight : ''}"
    role="cell"
    on:pointerleave={$_interaction.pointer?.leave}
    on:pointerdown={$_interaction.action?.select}
>
    <!-- Drag, Resize & Select -->
    {#if iChunks[0] && datesEqual(iChunks[0].date, date)}
        <div class="{$theme.events} {$theme.preview}">
            <Event chunk={iChunks[0]}/>
        </div>
    {/if}
    <div class="{$theme.events}">
        {#each dayChunks as chunk, i (chunk.event)}
            <Event {chunk} {longChunks} bind:this={refs[i]}/>
        {/each}
    </div>
</div>
