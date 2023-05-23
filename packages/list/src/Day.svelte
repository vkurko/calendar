<script>
    import {getContext} from 'svelte';
    import {
        addDay,
        cloneDate,
        createDate,
        createEventChunk,
        datesEqual,
        setMidnight,
        sortEventChunks,
        eventIntersects,
        setPayload,
        bgEvent
    } from '@event-calendar/core';
    import Event from './Event.svelte';

    export let date;

    let {_events, _interaction, highlightedDates, theme} = getContext('state');
    let {_intlListDayFormat, _intlListDaySideFormat} = getContext('view-state');

    let el;
    let chunks;
    let today = setMidnight(createDate()), isToday, highlight;

    $: {
        chunks = [];
        let start = date;
        let end = addDay(cloneDate(date));
        for (let event of $_events) {
            if (!bgEvent(event.display) && eventIntersects(event, start, end)) {
                let chunk = createEventChunk(event, start, end);
                chunks.push(chunk);
            }
        }
        sortEventChunks(chunks);
    }

    $: {
        isToday = datesEqual(date, today);
        highlight = $highlightedDates.some(d => datesEqual(d, date));
    }

    // dateFromPoint
    $: if (el) {
        setPayload(el, () => ({allDay: true, date, resource: undefined, dayEl: el}));
    }
</script>

{#if chunks.length}
    <div
        bind:this={el}
        class="{$theme.day}{isToday ? ' ' + $theme.today : ''}{highlight ? ' ' + $theme.highlight : ''}"
        on:pointerdown={$_interaction.action?.select}
    >
        {$_intlListDayFormat.format(date)}
        <span class="{$theme.daySide}">{$_intlListDaySideFormat.format(date)}</span>
    </div>
    {#each chunks as chunk (chunk.event)}
        <Event {chunk}/>
    {/each}
{/if}