<script>
    import {getContext, tick, afterUpdate} from 'svelte';
    import {is_function} from 'svelte/internal';
    import {createDate,	setMidnight, datesEqual, setContent, createEventChunk, addDay, cloneDate, assign, setPayload,
        debounce} from '@event-calendar/common';
    import Event from './Event.svelte';
    import Popup from './Popup.svelte';

    export let date;
    export let chunks;
    export let longChunks;
    export let iChunks = [];

    let {date: currentDate, dayMaxEvents, highlightedDates, moreLinkContent, theme,
        _interaction, _queue} = getContext('state');
    let {_hiddenEvents, _popupDate, _popupChunks} = getContext('view-state');

    let el;
    let dayChunks;
    let today = setMidnight(createDate());
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

    $: {
        isToday = datesEqual(date, today);
        otherMonth = date.getUTCMonth() !== $currentDate.getUTCMonth();
        highlight = $highlightedDates.some(d => datesEqual(d, date));
    }

    $: if ($_hiddenEvents && hiddenEvents.size) {  // make Svelte update this block on $_hiddenEvents update
        let text = '+' + hiddenEvents.size + ' more';
        if ($moreLinkContent) {
            moreLink = is_function($moreLinkContent) ? $moreLinkContent({num: hiddenEvents.size, text}) : $moreLinkContent;
            if (typeof moreLink === 'string') {
                moreLink = {html: moreLink};
            }
        } else {
            moreLink = {html: text};
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

    function createPointerEnterHandler(interaction) {
        return interaction.pointer
            ? jsEvent => interaction.pointer.enterDayGrid(date, jsEvent)
            : undefined;
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

    function reposition() {
        refs.length = dayChunks.length;
        for (let ref of refs) {
            ref && ref.reposition && ref.reposition();
        }
    }

    afterUpdate(reposition);

    let debounceHandle = {};
    $: if ($_hiddenEvents) {
        debounce(reposition, debounceHandle, _queue);
    }
</script>

<div
    bind:this={el}
    class="{$theme.day}{isToday ? ' ' + $theme.today : ''}{otherMonth ? ' ' + $theme.otherMonth : ''}{highlight ? ' ' + $theme.highlight : ''}"
    on:pointerenter={createPointerEnterHandler($_interaction)}
    on:pointerleave={$_interaction.pointer?.leave}
    on:pointerdown={$_interaction.action?.select}
>
    <div class="{$theme.dayHead}">{date.getUTCDate()}</div>
    <!-- Pointer -->
    {#if iChunks[1] && datesEqual(iChunks[1].date, date)}
        <div class="{$theme.events}">
            <Event chunk={iChunks[1]}/>
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
            <Event {chunk} {longChunks} bind:this={refs[i]}/>
        {/each}
    </div>
    {#if showPopup}
        <Popup/>
    {/if}
    <div class="{$theme.dayFoot}">
        {#if hiddenEvents.size}
            <a on:click|stopPropagation={showMore} on:pointerdown|stopPropagation use:setContent={moreLink}></a>
        {/if}
    </div>
</div>

<svelte:window on:resize={reposition}/>
