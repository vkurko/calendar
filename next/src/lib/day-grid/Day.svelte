<script>
    import {getContext, tick} from 'svelte';
    import {SvelteSet} from 'svelte/reactivity';
    import {
        addDay, assign, cloneDate, createEventChunk, datesEqual, getWeekNumber, isFunction, keyEnter, outsideRange,
        runReposition, setContent, setPayload, toISOString, toLocalDate
    } from '$lib/core';
    import Event from './Event.svelte';
    import Popup from './Popup.svelte';

    let {date, chunks, bgChunks, longChunks, iChunks = [], dates} = $props();

    let {
        date: currentDate, dayMaxEvents, highlightedDates, firstDay, moreLinkContent, theme, validRange, weekNumbers,
        weekNumberContent, _hiddenEvents, _intlDayCell, _popupDate, _popupChunks, _today, _interaction
    } = getContext('state');

    let el = $state();
    let hiddenEvents = new SvelteSet();  // hidden events of this day
    let refs = [];

    $effect(() => {
        $_hiddenEvents[date.getTime()] = hiddenEvents;
    });
    let isToday = $derived(datesEqual(date, $_today));
    let otherMonth = $derived(date.getUTCMonth() !== $currentDate.getUTCMonth());
    let highlight = $derived($highlightedDates.some(d => datesEqual(d, date)));
    let disabled = $derived(outsideRange(date, $validRange));

    let dayBgChunks = $derived(disabled || bgChunks.filter(bgChunk => datesEqual(bgChunk.date, date)));
    let dayChunks = $derived.by(() => {
        let dayChunks = [];
        if (!disabled) {
            hiddenEvents.clear();
            for (let chunk of chunks) {
                if (datesEqual(chunk.date, date)) {
                    dayChunks.push(chunk);
                    // if ($dayMaxEvents !== false && dayChunks.length > $dayMaxEvents) {
                    // 	chunk.hidden = true;
                    // }
                }
            }
        }
        return dayChunks;
    });

    let moreLink = $derived.by(() => {
        let moreLink = '';
        if (!disabled && $_hiddenEvents && hiddenEvents.size) {  // make Svelte update this block on $_hiddenEvents update
            let text = '+' + hiddenEvents.size + ' more';
            if ($moreLinkContent) {
                moreLink = isFunction($moreLinkContent)
                    ? $moreLinkContent({num: hiddenEvents.size, text})
                    : $moreLinkContent;
            } else {
                moreLink = text;
            }
        }
        return moreLink;
    });

    let showPopup = $derived($_popupDate && datesEqual(date, $_popupDate));

    $effect(() => {
        if (showPopup && longChunks && dayChunks) {
            // Let chunks to reposition then set popup chunks
            tick().then(setPopupChunks);
        }
    });

    // dateFromPoint
    $effect(() => {
        if (el) {
            setPayload(el, () => ({allDay: true, date, resource: undefined, dayEl: el, disabled}));
        }
    });

    function showMore(jsEvent) {
        jsEvent.stopPropagation();
        $_popupDate = date;
    }

    function setPopupChunks() {
        let nextDay = addDay(cloneDate(date));
        let chunks = dayChunks.concat(longChunks[date.getTime()]?.chunks || []);
        $_popupChunks = chunks
            .map(chunk => assign({}, chunk, createEventChunk(chunk.event, date, nextDay), {days: 1, dates: [date]}))
            .sort((a, b) => a.top - b.top);
    }

    let showWeekNumber = $derived($weekNumbers && date.getUTCDay() == ($firstDay ? 1 : 0));
    let weekNumber = $derived.by(() => {
        let weekNumber;
        if (showWeekNumber) {
            let week = getWeekNumber(date, $firstDay);
            if ($weekNumberContent) {
                weekNumber = isFunction($weekNumberContent)
                    ? $weekNumberContent({date: toLocalDate(date), week})
                    : $weekNumberContent;
            } else {
                weekNumber = 'W' + String(week).padStart(2, '0');
            }
        }
        return weekNumber;
    });

    export function reposition() {
        if (!disabled) {
            runReposition(refs, dayChunks);
        }
    }
</script>

<div
    bind:this={el}
    class="{$theme.day} {$theme.weekdays?.[date.getUTCDay()]}{isToday ? ' ' + $theme.today : ''}{otherMonth ? ' ' + $theme.otherMonth : ''}{highlight ? ' ' + $theme.highlight : ''}{disabled ? ' ' + $theme.disabled : ''}"
    role="cell"
    onpointerdown={$_interaction.action?.select}
>
    <div class="{$theme.dayHead}">
        <time
            datetime="{toISOString(date, 10)}"
            use:setContent={$_intlDayCell.format(date)}
        ></time>
        {#if showWeekNumber}
            <span
                class="{$theme.weekNumber}"
                use:setContent={weekNumber}
            ></span>
        {/if}
    </div>
    <div class="{$theme.bgEvents}">
        {#if !disabled}
            {#each dayBgChunks as chunk (chunk.event)}
                <Event {chunk}/>
            {/each}
        {/if}
    </div>
    {#if !disabled}
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
    {/if}
    <div class="{$theme.events}">
        {#if !disabled}
            {#each dayChunks as chunk, i (chunk.event)}
                <!-- svelte-ignore binding_property_non_reactive -->
                <Event {chunk} {longChunks} {dates} bind:this={refs[i]}/>
            {/each}
        {/if}
    </div>
    {#if showPopup}
        <Popup/>
    {/if}
    <div class="{$theme.dayFoot}">
        {#if !disabled && hiddenEvents.size}
            <!-- svelte-ignore a11y_missing_attribute -->
            <!-- svelte-ignore a11y_missing_content -->
            <!-- svelte-ignore a11y_consider_explicit_label -->
            <a
                role="button"
                tabindex="0"
                aria-haspopup="true"
                onclick={showMore}
                onkeydown={keyEnter(showMore)}
                onpointerdown={e => e.stopPropagation()}
                use:setContent={moreLink}
            ></a>
        {/if}
    </div>
</div>
