<script>
    import {getContext} from 'svelte';
    import {is_function} from 'svelte/internal';
    import {
        cloneDate,
        addDuration,
        toLocalDate,
        datesEqual,
        createEventChunk,
        toViewWithLocalDates,
        eventIntersects,
        rect,
        toISOString,
        maybeIgnore,
        setFn
    } from '@event-calendar/common';
    import {groupEventChunks} from './utils';
    import Event from './Event.svelte';
    import NowIndicator from './NowIndicator.svelte';

    export let date;
    export let resource = undefined;

    let {_events, _iEvents, dateClick, highlightedDates, nowIndicator, slotDuration, slotHeight, selectable, theme,
        _interaction, _today, _view} = getContext('state');
    let {_slotTimeLimits, _viewResources} = getContext('view-state');

    let el;
    let chunks, bgChunks, iChunks = [];
    let isToday, highlight;

    let start, end;

    $: {
        start = addDuration(cloneDate(date), $_slotTimeLimits.min);
        end = addDuration(cloneDate(date), $_slotTimeLimits.max);
    }

    $: {
        chunks = [];
        bgChunks = [];
        for (let event of $_events) {
            if (!event.allDay && eventIntersects(event, start, end, resource, true)) {
                let chunk = createEventChunk(event, start, end);
                switch (event.display) {
                    case 'background': bgChunks.push(chunk); break;
                    default: chunks.push(chunk);
                }
            }
        }
        groupEventChunks(chunks);
    }

    $: iChunks = $_iEvents.map(
        event => event && eventIntersects(event, start, end, resource, true) ? createEventChunk(event, start, end) : null
    );

    $: isToday = datesEqual(date, $_today);
    $: highlight = $highlightedDates.some(d => datesEqual(d, date));

    function dateFromPoint(y) {
        y -= rect(el).top;
        return addDuration(
            cloneDate(date),
            $slotDuration,
            Math.floor(y / $slotHeight + $_slotTimeLimits.min.seconds / $slotDuration.seconds)
        );
    }

    $: if (el) {
        setFn(el, dateFromPoint);
    }

    function createClickHandler(fn) {
        return is_function(fn)
            ? jsEvent => {
                let d = dateFromPoint(jsEvent.clientY);
                fn({
                    allDay: false,
                    date: toLocalDate(d),
                    dateStr: toISOString(d),
                    dayEl: el,
                    jsEvent,
                    view: toViewWithLocalDates($_view),
                    resource
                });
            }
            : undefined;
    }

    function createPointerEnterHandler(interaction) {
        return interaction.pointer
            ? jsEvent => interaction.pointer.enterTimeGrid(date, el, jsEvent, _slotTimeLimits, resource)
            : undefined;
    }

    function createPointerLeaveHandler(interaction) {
        return interaction.pointer ? interaction.pointer.leave : undefined;
    }

    function createPointerDownHandler(interaction, selectable) {
        return selectable && interaction.action
            ? jsEvent => interaction.action.selectTimeGrid(date, el, jsEvent, _viewResources, $_slotTimeLimits, false)
            : undefined;
    }
</script>

<div
    bind:this={el}
    class="{$theme.day}{isToday ? ' ' + $theme.today : ''}{highlight ? ' ' + $theme.highlight : ''}"
    on:click={maybeIgnore(createClickHandler($dateClick))}
    on:pointerenter={createPointerEnterHandler($_interaction)}
    on:pointerleave={createPointerLeaveHandler($_interaction)}
    on:pointerdown={createPointerDownHandler($_interaction, $selectable)}
>
    <div class="{$theme.bgEvents}">
        {#each bgChunks as chunk (chunk.event)}
            <Event {date} {chunk}/>
        {/each}
    </div>
    <div class="{$theme.events}">
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
    </div>
    <div class="{$theme.extra}">
        <!-- Now indicator -->
        {#if $nowIndicator && isToday}
            <NowIndicator />
        {/if}
    </div>
</div>