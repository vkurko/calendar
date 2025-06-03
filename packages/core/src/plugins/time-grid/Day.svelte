<script>
    import {getContext, onMount} from 'svelte';
    import {
        addDuration, bgEvent, cloneDate, createEventChunk, datesEqual, eventIntersects, floor, outsideRange, rect,
        setPayload
    } from '#lib';
    import {groupEventChunks} from './utils.js';
    import Event from './Event.svelte';
    import NowIndicator from './NowIndicator.svelte';

    let {date, resource = undefined} = $props();

    let {_filteredEvents, _iEvents, highlightedDates, nowIndicator, slotDuration, slotHeight, filterEventsWithResources,
        theme, resources, validRange, _interaction, _today, _slotTimeLimits} = getContext('state');

    let el = $state();

    let isToday = $derived(datesEqual(date, $_today));
    let highlight = $derived($highlightedDates.some(d => datesEqual(d, date)));
    let disabled = $derived(outsideRange(date, $validRange));

    let start = $derived(addDuration(cloneDate(date), $_slotTimeLimits.min));
    let end = $derived(addDuration(cloneDate(date), $_slotTimeLimits.max));

    let resourceFilter = $derived(resource ?? ($filterEventsWithResources ? $resources : undefined));

    let [chunks, bgChunks] = $derived.by(() => {
        if (disabled) {
            return [[], []];
        }
        let chunks = [];
        let bgChunks = [];
        for (let event of $_filteredEvents) {
            if ((!event.allDay || bgEvent(event.display)) && eventIntersects(event, start, end, resourceFilter)) {
                let chunk = createEventChunk(event, start, end);
                switch (event.display) {
                    case 'background': bgChunks.push(chunk); break;
                    default: chunks.push(chunk);
                }
            }
        }
        groupEventChunks(chunks);
        return [chunks, bgChunks];
    });

    let iChunks = $derived.by(() => {
        if (disabled) {
            return [];
        }
        return $_iEvents.map(
            event => event && eventIntersects(event, start, end, resource) ? createEventChunk(event, start, end) : null
        );
    });

    function dateFromPoint(x, y) {
        y -= rect(el).top;
        return {
            allDay: false,
            date: addDuration(
                addDuration(cloneDate(date), $_slotTimeLimits.min),
                $slotDuration,
                floor(y / $slotHeight)
            ),
            resource,
            dayEl: el,
            disabled
        };
    }

    onMount(() => {
        setPayload(el, dateFromPoint);
    });
</script>

<div
    bind:this={el}
    class="{$theme.day} {$theme.weekdays?.[date.getUTCDay()]}{isToday ? ' ' + $theme.today : ''}{highlight ? ' ' + $theme.highlight : ''}{disabled ? ' ' + $theme.disabled : ''}"
    role="cell"
    onpointerdown={!disabled ? $_interaction.action?.select : undefined}
>
    <div class="{$theme.bgEvents}">
        {#if !disabled}
            {#each bgChunks as chunk (chunk.event)}
                <Event {date} {chunk}/>
            {/each}
        {/if}
    </div>
    <div class="{$theme.events}">
        {#if !disabled}
            <!-- Pointer -->
            {#if iChunks[1]}
                <Event {date} chunk={iChunks[1]}/>
            {/if}
            {#each chunks as chunk (chunk.event)}
                <Event {date} {chunk}/>
            {/each}
            <!-- Drag, Resize & Select -->
            {#if iChunks[0] && !iChunks[0].event.allDay}
                <Event {date} chunk={iChunks[0]}/>
            {/if}
        {/if}
    </div>
    <div class="{$theme.extra}">
        <!-- Now indicator -->
        {#if $nowIndicator && isToday && !disabled}
            <NowIndicator />
        {/if}
    </div>
</div>
