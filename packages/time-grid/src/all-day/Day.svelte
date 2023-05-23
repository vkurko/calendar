<script>
    import {afterUpdate, getContext} from 'svelte';
    import {
        createDate,
        setMidnight,
        datesEqual,
        setPayload
    } from '@event-calendar/core';
    import Event from './Event.svelte';

    export let date;
    export let chunks;
    export let longChunks;
    export let iChunks = [];
    export let resource = undefined;

    let {highlightedDates, theme, _interaction} = getContext('state');

    let el;
    let dayChunks;
    let today = setMidnight(createDate());
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

    $: {
        isToday = datesEqual(date, today);
        highlight = $highlightedDates.some(d => datesEqual(d, date));
    }

    // dateFromPoint
    $: if (el) {
        setPayload(el, () => ({allDay: true, date, resource, dayEl: el}));
    }

    function createPointerDownHandler(interaction, selectable) {
        return selectable && interaction.action
            ? interaction.action.select
            : undefined;
    }

    function reposition() {
        refs.length = dayChunks.length;
        for (let ref of refs) {
            ref && ref.reposition && ref.reposition();
        }
    }

    afterUpdate(reposition);
</script>

<div
    bind:this={el}
    class="{$theme.day}{isToday ? ' ' + $theme.today : ''}{highlight ? ' ' + $theme.highlight : ''}"
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

<svelte:window on:resize={reposition}/>
