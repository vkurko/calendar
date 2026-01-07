<script>
    import {getContext, setContext, tick} from 'svelte';
    import {contentFrom, resizeObserver, runReposition, toSeconds} from '#lib';
    import {createAllDayContent} from './lib.js';
    import ViewState from './state.svelte.js';
    import {ColHead, DayHeader} from '#components';
    import Day from './Day.svelte';
    import Event from './Event.svelte';
    import AllDayEvent from './AllDayEvent.svelte';
    import NowIndicator from './NowIndicator.svelte';

    let {header, nowIndicator, viewState} = $props();

    let mainState = getContext('state');
    // svelte-ignore state_referenced_locally
    if (!viewState) {
        viewState = new ViewState(mainState);
    }
    // svelte-ignore state_referenced_locally
    setContext('view-state', viewState);

    let {mainEl, viewDates, options: {allDayContent, allDaySlot, columnWidth, nowIndicator: showNowIndicator,
        scrollTime, slotHeight, slotDuration, theme}} = $derived(mainState);
    let {allDayChunks, allDayBgChunks, allDayIChunks, bgChunks, chunks, iChunks, grid, sidebarWidth, slots,
        slotLabelPeriodicity, slotTimeLimits} = $derived(viewState);

    let headerHeight = $state(0);
    let allDayText = $derived(createAllDayContent(allDayContent));

    // Handle scrollTime
    $effect(() => {
        viewDates;
        scrollTime;
        tick().then(scrollToTime);
    });
    function scrollToTime() {
        mainEl.scrollTop = (
            (toSeconds(scrollTime) - toSeconds(slotTimeLimits.min)) / toSeconds(slotDuration) - 0.5
        ) * slotHeight;
    }

    // Events reposition
    let refs = [];
    function reposition() {
        runReposition(refs, allDayChunks);
    }
    $effect(reposition);
</script>

<section
    bind:this={mainState.mainEl}
    class="{theme.main}"
    style:--ec-grid-cols="{grid.length * grid[0].length}"
    style:--ec-col-group-span="{grid[0].length}"
    style:--ec-col-width="{columnWidth ?? 'minmax(0, 1fr)'}"
    style:--ec-slot-label-periodicity="{slotLabelPeriodicity}"
    style:--ec-slot-height="{slotHeight}px"
    style:--ec-header-height="{headerHeight}px"
    style:--ec-sidebar-width="{sidebarWidth}px"
    {@attach resizeObserver(reposition)}
>
    <header bind:offsetHeight={headerHeight} class="{theme.header}">
        <aside class="{theme.sidebar}" bind:offsetWidth={viewState.sidebarWidth}></aside>
        <div class="{theme.grid}" role="row">
            {#if header}
                {@render header()}
            {:else}
                {#each grid[0] as {dayStart: date, disabled, highlight}, i}
                    <ColHead {date} colIndex={1 + i} {disabled} {highlight}>
                        <DayHeader {date}/>
                    </ColHead>
                {/each}
            {/if}
        </div>

        {#if allDaySlot}
            <div class="{theme.allDay}">
                <aside class="{theme.sidebar}" {@attach contentFrom(allDayText)}></aside>
                <div class="{theme.grid}" role="row">
                    {#each grid as days, i}
                        {#each days as day, j}
                            <Day {day} allDay noIeb={i + 1 === grid.length && j + 1 === days.length}/>
                        {/each}
                    {/each}
                </div>
                <div class="{theme.events}">
                    {#each allDayChunks as chunk, i (chunk.id)}
                        <!-- svelte-ignore binding_property_non_reactive -->
                        <AllDayEvent bind:this={refs[i]} {chunk}/>
                    {/each}
                    {#each allDayBgChunks as chunk (chunk.id)}
                        <AllDayEvent {chunk}/>
                    {/each}
                    {#each allDayIChunks as chunk}
                        <AllDayEvent {chunk}/>
                    {/each}
                </div>
            </div>
        {/if}
    </header>

    <div class="{theme.body}" role="rowgroup">
        <aside class="{theme.sidebar}" aria-hidden="true">
            {#each slots as slot, i}
                <div
                    class={[theme.slot, !i && theme.hidden]}
                    style:--ec-slot-label-periodicity={slot[2]}
                >
                    <time
                        datetime="{slot[0]}"
                        {@attach contentFrom(slot[1])}
                    ></time>
                </div>
            {/each}
        </aside>
        <div class="{theme.grid}" role="row">
            {#each grid as days, i}
                {#each days as day, j}
                    <Day {day} noIeb={i + 1 === grid.length && j + 1 === days.length} noBeb/>
                {/each}
            {/each}
        </div>
        <div class="{theme.events}">
            {#each chunks as chunk (chunk.id)}
                <Event {chunk}/>
            {/each}
            {#each bgChunks as chunk (chunk.id)}
                <Event {chunk}/>
            {/each}
            {#each iChunks as chunk}
                <Event {chunk}/>
            {/each}
        </div>
    </div>

    {#if showNowIndicator}
        {#if nowIndicator}
            {@render nowIndicator()}
        {:else}
            <NowIndicator days={grid[0]}/>
        {/if}
    {/if}
</section>
