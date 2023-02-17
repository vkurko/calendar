<script>
    import {getContext, tick} from 'svelte';
    import {is_function} from 'svelte/internal';
    import {createDate,	setMidnight, toLocalDate, datesEqual, setContent, toViewWithLocalDates,	toISOString,
        createEventChunk, addDay, cloneDate, assign, maybeIgnore, setFn} from '@event-calendar/common';
    import Event from './Event.svelte';
    import Popup from './Popup.svelte';

    export let date;
    export let chunks;
    export let longChunks;
    export let iChunks = [];

    let {date: currentDate, dateClick, dayMaxEvents, highlightedDates, moreLinkContent, theme,
        _view, _interaction, selectable} = getContext('state');
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
        setPopupChunks();
    }

    // dateFromPoint
    $: if (el) {
        setFn(el, () => date);
    }

    function createClickHandler(fn) {
        return is_function(fn)
            ? jsEvent => fn({
                allDay: true,
                date: toLocalDate(date),
                dateStr: toISOString(date),
                dayEl: el,
                jsEvent,
                view: toViewWithLocalDates($_view)
            })
            : undefined;
    }

    function createPointerEnterHandler(interaction) {
        return interaction.pointer
            ? jsEvent => interaction.pointer.enterDayGrid(date, jsEvent)
            : undefined;
    }

    function createPointerLeaveHandler(interaction) {
        return interaction.pointer ? interaction.pointer.leave : undefined;
    }

    function showMore() {
        $_popupDate = date;
    }

    function setPopupChunks() {
        let nextDay = addDay(cloneDate(date));
        let chunks = dayChunks.concat(longChunks[date.getTime()] || []);
        if (chunks.every(chunk => chunk.ready)) {
            $_popupChunks = chunks
                .map(chunk => assign({}, chunk, createEventChunk(chunk.event, date, nextDay), {days: 1, dates: [date]}))
                .sort((a, b) => a.top - b.top);
        } else {
            tick().then(setPopupChunks);
        }
    }

    function createPointerDownHandler(interaction, selectable) {
        return selectable && interaction.action
            ? jsEvent => interaction.action.selectDayGrid(date, el, jsEvent)
            : undefined;
    }
</script>

<div
    bind:this={el}
    class="{$theme.day}{isToday ? ' ' + $theme.today : ''}{otherMonth ? ' ' + $theme.otherMonth : ''}{highlight ? ' ' + $theme.highlight : ''}"
    on:click={maybeIgnore(createClickHandler($dateClick))}
    on:pointerenter={createPointerEnterHandler($_interaction)}
    on:pointerleave={createPointerLeaveHandler($_interaction)}
    on:pointerdown={createPointerDownHandler($_interaction, $selectable)}
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
        {#each dayChunks as chunk (chunk.event)}
            <Event {chunk} {longChunks}/>
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