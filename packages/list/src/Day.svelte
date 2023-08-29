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
        setContent,
        setPayload,
        bgEvent
    } from '@event-calendar/core';
    import Event from './Event.svelte';

    export let date;

    let {_events, _interaction, _intlListDay, _intlListDaySide, highlightedDates, theme} = getContext('state');

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
        class="{$theme.day} {$theme.weekdays?.[date.getUTCDay()]}{isToday ? ' ' + $theme.today : ''}{highlight ? ' ' + $theme.highlight : ''}"
        on:pointerdown={$_interaction.action?.select}
    >
        <span use:setContent={$_intlListDay.format(date)}></span>
        <span class="{$theme.daySide}" use:setContent={$_intlListDaySide.format(date)}></span>
    </div>
    {#each chunks as chunk (chunk.event)}
        <Event {chunk}/>
    {/each}
{/if}