<script>
    import {getContext} from 'svelte';
    import {
        addDay, bgEvent, cloneDate, createEventChunk, datesEqual, eventIntersects, outsideRange, contentFrom, toISOString
    } from '#lib';
    import {BaseDay} from '#components';
    import Event from './Event.svelte';

    let {date} = $props();

    let {filteredEvents, options: {highlightedDates, theme, validRange}} = $derived(getContext('state'));
    let {intlListDay, intlListDaySide} = $derived(getContext('view-state'));

    let highlight = $derived(highlightedDates.some(d => datesEqual(d, date)));
    let disabled = $derived(outsideRange(date, validRange));
    let datetime = $derived(toISOString(date, 10));

    let chunks = $derived.by(() => {
        let chunks = [];
        if (!disabled) {
            let start = date;
            let end = addDay(cloneDate(date));
            for (let event of filteredEvents) {
                if (!bgEvent(event.display) && eventIntersects(event, start, end)) {
                    let chunk = createEventChunk(event, start, end);
                    chunks.push(chunk);
                }
            }
        }
        return chunks;
    });
</script>

{#if chunks.length}
    <BaseDay {date} allDay role="listitem" {disabled} {highlight}>
        <!-- svelte-ignore a11y_missing_content -->
        <h4 class="{theme.dayHead}">
            <time {datetime} {@attach contentFrom(intlListDay.format(date))}></time>
            <time class="{theme.daySide}" {datetime} {@attach contentFrom(intlListDaySide.format(date))}></time>
        </h4>
        {#each chunks as chunk (chunk.event)}
            <Event {chunk}/>
        {/each}
    </BaseDay>
{/if}
