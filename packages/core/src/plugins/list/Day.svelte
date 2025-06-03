<script>
    import {getContext} from 'svelte';
    import {
        addDay, bgEvent, cloneDate, createEventChunk, datesEqual, eventIntersects, outsideRange, setContent, setPayload,
        sortEventChunks, toISOString
    } from '#lib';
    import Event from './Event.svelte';

    let {date} = $props();

    let {_filteredEvents, _interaction, _intlListDay, _intlListDaySide, _today,
        resources, filterEventsWithResources, highlightedDates, theme, validRange} = getContext('state');

    let el = $state();
    let isToday = $derived(datesEqual(date, $_today));
    let highlight = $derived($highlightedDates.some(d => datesEqual(d, date)));
    let disabled = $derived(outsideRange(date, $validRange));
    let datetime = $derived(toISOString(date, 10));

    let chunks = $derived.by(() => {
        let chunks = [];
        if (!disabled) {
            let start = date;
            let end = addDay(cloneDate(date));
            for (let event of $_filteredEvents) {
                if (!bgEvent(event.display) && eventIntersects(event, start, end, $filterEventsWithResources ? $resources : undefined)) {
                    let chunk = createEventChunk(event, start, end);
                    chunks.push(chunk);
                }
            }
            sortEventChunks(chunks);
        }
        return chunks;
    });

    // dateFromPoint
    $effect(() => {
        if (el) {
            setPayload(el, () => ({allDay: true, date, resource: undefined, dayEl: el, disabled}));
        }
    });
</script>

{#if chunks.length}
    <div
        bind:this={el}
        class="{$theme.day} {$theme.weekdays?.[date.getUTCDay()]}{isToday ? ' ' + $theme.today : ''}{highlight ? ' ' + $theme.highlight : ''}"
        role="listitem"
        onpointerdown={$_interaction.action?.select}
    >
        <!-- svelte-ignore a11y_missing_content -->
        <h4 class="{$theme.dayHead}">
            <time {datetime} use:setContent={$_intlListDay.format(date)}></time>
            <time class="{$theme.daySide}" {datetime} use:setContent={$_intlListDaySide.format(date)}></time>
        </h4>
        {#each chunks as chunk (chunk.event)}
            <Event {chunk}/>
        {/each}
    </div>
{/if}
