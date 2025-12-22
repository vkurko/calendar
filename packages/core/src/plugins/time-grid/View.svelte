<script>
    import {getContext, tick} from 'svelte';
    import {
        addDuration, cloneDate, contentFrom, DAY_IN_SECONDS, resizeObserver, runReposition, subtractDay, toSeconds
    } from '#lib';
    import {createAllDayContent, createGrid, createEventChunks, createIEventChunks} from './lib.js';
    import {ColHead, DayHeader} from '#components';
    import Day from './Day.svelte';
    import Event from './Event.svelte';
    import AllDayEvent from './AllDayEvent.svelte';
    import NowIndicator from './NowIndicator.svelte';

    let {header, nowIndicator, createGridFn} = $props();

    let {_activeRangeExt, _mainEl, _filteredEvents, _iEvents, _sidebarWidth, _slotLabelPeriodicity, _slotTimeLimits, _slots,
        _viewDates, allDayContent, allDaySlot, columnWidth, highlightedDates, nowIndicator: showNowIndicator,
        scrollTime, slotHeight, slotDuration, slotMaxTime, theme, validRange} = getContext('state');

    let headerHeight = $state(0);
    let allDayText = $derived(createAllDayContent($allDayContent));

    let grid = $derived(createGridFn?.() ?? createGrid($_viewDates, $_slotTimeLimits, $validRange, $highlightedDates));
    let {chunks, bgChunks, allDayChunks, allDayBgChunks} = $derived(createEventChunks($_filteredEvents, grid));
    let {iChunks, allDayIChunks} = $derived(createIEventChunks($_iEvents, grid));

    $effect.pre(() => {
        $_activeRangeExt = ({start, end}) => {
            if ($slotMaxTime.days || $slotMaxTime.seconds > DAY_IN_SECONDS) {
                addDuration(subtractDay(end), $slotMaxTime);
                let start2 = subtractDay(cloneDate(end));
                if (start2 < start) {
                    start = start2;
                }
            }
            return {start, end};
        };
    });

    // Handle scrollTime
    $effect(() => {
        $_viewDates;
        $scrollTime;
        tick().then(scrollToTime);
    });
    function scrollToTime() {
        $_mainEl.scrollTop = (
            (toSeconds($scrollTime) - toSeconds($_slotTimeLimits.min)) / toSeconds($slotDuration) - 0.5
        ) * $slotHeight;
    }

    // Events reposition
    let refs = [];
    function reposition() {
        runReposition(refs, allDayChunks);
    }
    $effect(reposition);
</script>

<section
    bind:this={$_mainEl}
    class="{$theme.main}"
    style:--ec-grid-cols="{grid.length * grid[0].length}"
    style:--ec-col-group-span="{grid[0].length}"
    style:--ec-col-width="{$columnWidth ?? 'minmax(0, 1fr)'}"
    style:--ec-slot-label-periodicity="{$_slotLabelPeriodicity}"
    style:--ec-slot-height="{$slotHeight}px"
    style:--ec-header-height="{headerHeight}px"
    style:--ec-sidebar-width="{$_sidebarWidth}px"
    {@attach resizeObserver(reposition)}
>
    <header bind:offsetHeight={headerHeight} class="{$theme.header}">
        <aside class="{$theme.sidebar}" bind:offsetWidth={$_sidebarWidth}></aside>
        <div class="{$theme.grid}" role="row">
            {#if header}
                {@render header(grid)}
            {:else}
                {#each grid[0] as {dayStart: date, disabled, highlight}, i}
                    <ColHead {date} colIndex={1 + i} {disabled} {highlight}>
                        <DayHeader {date}/>
                    </ColHead>
                {/each}
            {/if}
        </div>

        {#if $allDaySlot}
            <div class="{$theme.allDay}">
                <aside class="{$theme.sidebar}" {@attach contentFrom(allDayText)}></aside>
                <div class="{$theme.grid}" role="row">
                    {#each grid as days, i}
                        {#each days as day, j}
                            <Day {day} allDay noIeb={i + 1 === grid.length && j + 1 === days.length}/>
                        {/each}
                    {/each}
                </div>
                <div class="{$theme.events}">
                    {#each allDayChunks as chunk, i}
                        <!-- svelte-ignore binding_property_non_reactive -->
                        <AllDayEvent bind:this={refs[i]} {chunk}/>
                    {/each}
                    {#each allDayBgChunks as chunk}
                        <AllDayEvent {chunk}/>
                    {/each}
                    {#each allDayIChunks as chunk}
                        <AllDayEvent {chunk}/>
                    {/each}
                </div>
            </div>
        {/if}
    </header>

    <div class="{$theme.body}" role="rowgroup">
        <aside class="{$theme.sidebar}" aria-hidden="true">
            {#each $_slots as slot, i}
                <div
                    class={[$theme.slot, !i && $theme.hidden]}
                    style:--ec-slot-label-periodicity={slot[2]}
                >
                    <time
                        datetime="{slot[0]}"
                        {@attach contentFrom(slot[1])}
                    ></time>
                </div>
            {/each}
        </aside>
        <div class="{$theme.grid}" role="row">
            {#each grid as days, i}
                {#each days as day, j}
                    <Day {day} noIeb={i + 1 === grid.length && j + 1 === days.length} noBeb/>
                {/each}
            {/each}
        </div>
        <div class="{$theme.events}">
            {#each chunks as chunk}
                <Event {chunk}/>
            {/each}
            {#each bgChunks as chunk}
                <Event {chunk}/>
            {/each}
            {#each iChunks as chunk}
                <Event {chunk}/>
            {/each}
        </div>
    </div>

    {#if $showNowIndicator}
        {#if nowIndicator}
            {@render nowIndicator(grid)}
        {:else}
            <NowIndicator days={grid[0]}/>
        {/if}
    {/if}
</section>
