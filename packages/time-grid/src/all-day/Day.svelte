<script>
    import {afterUpdate, getContext} from 'svelte';
    import {is_function} from 'svelte/internal';
    import {
        createDate,
        setMidnight,
        toLocalDate,
        datesEqual,
        toViewWithLocalDates,
        toISOString,
        maybeIgnore,
        setFn
    } from '@event-calendar/common';
    import Event from './Event.svelte';

    export let date;
    export let chunks;
    export let longChunks;
    export let iChunks = [];
    export let resource = undefined;

    let {date: currentDate, dateClick, highlightedDates, theme, _view, _interaction, selectable} = getContext('state');
    let {_slotTimeLimits, _viewResources} = getContext('view-state');

    let el;
    let dayChunks;
    let today = setMidnight(createDate());
    let isToday;
    let highlight;
    let refs = [];

    $: {
        dayChunks = [];
        for (let chunk of chunks) {
            if (datesEqual(chunk.date, date)) {
                dayChunks.push(chunk);
            }
        }
    }

    $: {
        isToday = datesEqual(date, today);
        highlight = $highlightedDates.some(d => datesEqual(d, date));
    }

    // dateFromPoint
    $: if (el) {
        setFn(el, () => date);
    }

    function createClickHandler(fn) {
        return is_function(fn)
            ? jsEvent => {
                fn({
                    allDay: true,
                    date: toLocalDate(date),
                    dateStr: toISOString(date),
                    dayEl: el,
                    jsEvent,
                    view: toViewWithLocalDates($_view),
                    resource
                });
            }
            : undefined;
    }

    function createPointerDownHandler(interaction, selectable) {
        return selectable && interaction.action
            ? jsEvent => interaction.action.selectTimeGrid(date, el, jsEvent, _viewResources, $_slotTimeLimits, true)
            : undefined;
    }

    function reposition() {
        refs.length = dayChunks.length;
        for (let ref of refs) {
            ref && ref.reposition && ref.reposition();
        }
    }

    afterUpdate(reposition);
</script>

<div
    bind:this={el}
    class="{$theme.day}{isToday ? ' ' + $theme.today : ''}{highlight ? ' ' + $theme.highlight : ''}"
    on:click={maybeIgnore(createClickHandler($dateClick))}
    on:pointerdown={createPointerDownHandler($_interaction, $selectable)}
>
    <!-- Drag, Resize & Select -->
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
</div>

<svelte:window on:resize={reposition}/>
