<script>
    import {getContext} from 'svelte';
    import {contentFrom, identity, nextClosestDay, prevClosestDay, resizeObserver, runReposition} from '#lib';
    import Day from './Day.svelte';
    import Event from './Event.svelte';
    import Popup from './Popup.svelte';
    import {createEventChunks, createIEventChunks, createGrid} from './lib.js';

    let {_activeRangeExt, _mainEl, _colsCount, _filteredEvents, _hiddenChunks, _iEvents, _intlDayHeader,
        _intlDayHeaderAL, _popupDay, _viewDates, dayMaxEvents, firstDay, highlightedDates, theme,
        validRange} = getContext('state');

    let gridEl = $state();
    let grid = $derived(createGrid($_viewDates, $_colsCount, $validRange, $highlightedDates));
    let {chunks, bgChunks} = $derived(createEventChunks($_filteredEvents, grid));
    let iChunks = $derived(createIEventChunks($_iEvents, grid));

    $effect.pre(() => {
        $_activeRangeExt = ({start, end}) => ({
            start: prevClosestDay(start, $firstDay),
            end: nextClosestDay(end, $firstDay)
        });
    });

    // Events reposition
    let refs = [];
    function reposition() {
        $_hiddenChunks = {};
        runReposition(refs, chunks);
    }
    $effect(reposition);
    $effect(() => {
        $_hiddenChunks;
        refs.forEach(ref => ref.hide());
    });
</script>

<section
    bind:this={$_mainEl}
    class={[$theme.main, $dayMaxEvents === true && $theme.uniform]}
    style:--ec-grid-cols="{grid[0].length}"
    style:--ec-grid-rows="{grid.length}"
    {@attach resizeObserver(reposition)}
>
    <header class="{$theme.header}">
        <div class="{$theme.grid}" role="row">
            {#each grid[0] as {dayStart}, i}
                <div
                    class={[$theme.colHead, $theme.weekdays?.[dayStart.getUTCDay()]]}
                    role="columnheader"
                    aria-colindex="{1 + i}"
                >
                    <span
                        aria-label="{$_intlDayHeaderAL.format(dayStart)}"
                        {@attach contentFrom($_intlDayHeader.format(dayStart))}
                    ></span>
                </div>
            {/each}
        </div>
    </header>

    <div class="{$theme.body}">
        <div bind:this={gridEl} class="{$theme.grid}">
            {#each grid as days, i}
                {#each days as day, j}
                    <Day {day} noIeb={j + 1 === days.length} noBeb={i + 1 === grid.length}/>
                {/each}
            {/each}
        </div>
        <div class="{$theme.events}">
            {#each chunks as chunk, i}
                <!-- svelte-ignore binding_property_non_reactive -->
                <Event bind:this={refs[i]} {chunk} {gridEl}/>
            {/each}
            {#each bgChunks as chunk}
                <Event {chunk}/>
            {/each}
            {#each iChunks as chunk}
                <Event {chunk} {gridEl}/>
            {/each}
        </div>
    </div>

    {#if $_popupDay}
        <Popup {gridEl} {chunks}/>
    {/if}
</section>
