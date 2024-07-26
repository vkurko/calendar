<script>
    import {getContext, tick} from 'svelte';
    import {is_function} from 'svelte/internal';
    import {datesEqual, setContent, createEventChunk, addDay, cloneDate, assign, setPayload, toISOString,
        keyEnter, runReposition} from '@event-calendar/core';
    import Event from './Event.svelte';
    import Popup from './Popup.svelte';

    export let date;
    export let chunks;
    export let bgChunks;
    export let longChunks;
    export let iChunks = [];
    export let dates;

    let {date: currentDate, dayMaxEvents, highlightedDates, moreLinkContent, theme,
        _hiddenEvents, _intlDayCell, _popupDate, _popupChunks, _today, _interaction, _queue} = getContext('state');

    let el;
    let dayChunks, dayBgChunks;
    let isToday;
    let otherMonth;
    let highlight;
    let hiddenEvents = new Set();  // hidden events of this day
    let moreLink = '';
    let showPopup;
    let refs = [];

    $: $_hiddenEvents[date.getTime()] = hiddenEvents;

    $: {
        dayChunks = [];
        dayBgChunks = bgChunks.filter(bgChunk => datesEqual(bgChunk.date, date));
        hiddenEvents.clear();
        hiddenEvents = hiddenEvents;
        for (let chunk of chunks) {
            if (datesEqual(chunk.date, date)) {
                dayChunks.push(chunk);
                // if ($dayMaxEvents !== false && dayChunks.length > $dayMaxEvents) {
                // 	chunk.hidden = true;
                // }
            }
        }
    }

    $: isToday = datesEqual(date, $_today);
    $: {
        otherMonth = date.getUTCMonth() !== $currentDate.getUTCMonth();
        highlight = $highlightedDates.some(d => datesEqual(d, date));
    }

    $: if ($_hiddenEvents && hiddenEvents.size) {  // make Svelte update this block on $_hiddenEvents update
        let text = '+' + hiddenEvents.size + ' more';
        if ($moreLinkContent) {
            moreLink = is_function($moreLinkContent)
                ? $moreLinkContent({num: hiddenEvents.size, text})
                : $moreLinkContent;
        } else {
            moreLink = text;
        }
    }

    $: showPopup = $_popupDate && datesEqual(date, $_popupDate);

    $: if (showPopup && longChunks && dayChunks) {
        // Let chunks to reposition then set popup chunks
        tick().then(setPopupChunks);
    }

    // dateFromPoint
    $: if (el) {
        setPayload(el, () => ({allDay: true, date, resource: undefined, dayEl: el}));
    }

    function showMore() {
        $_popupDate = date;
    }

    function setPopupChunks() {
        let nextDay = addDay(cloneDate(date));
        let chunks = dayChunks.concat(longChunks[date.getTime()]?.chunks || []);
        $_popupChunks = chunks
            .map(chunk => assign({}, chunk, createEventChunk(chunk.event, date, nextDay), {days: 1, dates: [date]}))
            .sort((a, b) => a.top - b.top);
    }

    export function reposition() {
        runReposition(refs, dayChunks);
    }
</script>

<div
    bind:this={el}
    class="{$theme.day} {$theme.weekdays?.[date.getUTCDay()]}{isToday ? ' ' + $theme.today : ''}{otherMonth ? ' ' + $theme.otherMonth : ''}{highlight ? ' ' + $theme.highlight : ''}"
    role="cell"
    on:pointerleave={$_interaction.pointer?.leave}
    on:pointerdown={$_interaction.action?.select}
>
    <time
        class="{$theme.dayHead}"
        datetime="{toISOString(date, 10)}"
        use:setContent={$_intlDayCell.format(date)}
    ></time>
    <div class="{$theme.bgEvents}">
        {#each dayBgChunks as chunk (chunk.event)}
            <Event {chunk}/>
        {/each}
    </div>
    <!-- Pointer -->
    {#if iChunks[2] && datesEqual(iChunks[2].date, date)}
        <div class="{$theme.events}">
            <Event chunk={iChunks[2]}/>
        </div>
    {/if}
    <!-- Drag & Resize -->
    {#if iChunks[0] && datesEqual(iChunks[0].date, date)}
        <div class="{$theme.events} {$theme.preview}">
            <Event chunk={iChunks[0]}/>
        </div>
    {/if}
    <div class="{$theme.events}">
        {#each dayChunks as chunk, i (chunk.event)}
            <Event {chunk} {longChunks} {dates} bind:this={refs[i]} />
        {/each}
    </div>
    {#if showPopup}
        <Popup/>
    {/if}
    <div class="{$theme.dayFoot}">
        {#if hiddenEvents.size}
            <!-- svelte-ignore a11y-missing-attribute -->
            <!-- svelte-ignore a11y-missing-content -->
            <a
                role="button"
                tabindex="0"
                aria-haspopup="true"
                on:click|stopPropagation={showMore}
                on:keydown={keyEnter(showMore)}
                on:pointerdown|stopPropagation
                use:setContent={moreLink}
            ></a>
        {/if}
    </div>
</div>
