<script>
    import {getContext, setContext, tick} from 'svelte';
    import {max, resizeObserver, runReposition, contentFrom, toSeconds, datesEqual, min, isRtl} from '#lib';
    import {getSlotTimeLimits} from './lib.js';
    import ViewState from './state.svelte.js';
    import {ColHead, DayHeader} from '#components';
    import Label from '../resource-time-grid/Label.svelte';
    import Day from './Day.svelte';
    import Event from './Event.svelte';
    import Expander from './Expander.svelte';
    import NowIndicator from './NowIndicator.svelte';

    let mainState = getContext('state');
    let viewState = new ViewState(mainState);
    setContext('view-state', viewState);

    let {mainEl, today, viewDates, options: {columnWidth, nowIndicator, scrollTime, slotDuration, slotHeight, slotWidth, theme}} = $derived(mainState);
    let {chunks, bgChunks, iChunks, daySlots, dayTimeLimits, grid, monthView, nestedResources, sidebarWidth,
        slotLabelPeriodicity, viewResources} = $derived(viewState);

    let headerHeight = $state(0);

    // Handle scrollTime
    $effect(() => {
        viewDates;
        scrollTime;
        tick().then(scrollToTime);
    });
    function scrollToTime() {
        let scrollLeft = 0;
        let todayOutOfView = today < viewDates[0] || today > viewDates.at(-1);
        if (monthView) {
            if (!todayOutOfView) {
                let days = grid[0];
                for (let day of days) {
                    if (datesEqual(day.dayStart, today)) {
                        mainEl.scrollLeft = (mainEl.scrollWidth - sidebarWidth) / days.length * (day.gridColumn - 1) * (isRtl() ? -1 : 1);
                        break;
                    }
                }
            }
        } else {
            for (let date of viewDates) {
                let slotTimeLimits = getSlotTimeLimits(dayTimeLimits, date);
                if (todayOutOfView || datesEqual(date, today)) {
                    scrollLeft += max(
                        min(toSeconds(scrollTime), toSeconds(slotTimeLimits.max)) - toSeconds(slotTimeLimits.min),
                        0
                    );
                    break;
                } else {
                    scrollLeft += toSeconds(slotTimeLimits.max) - toSeconds(slotTimeLimits.min);
                }
            }
            mainEl.scrollLeft = scrollLeft / toSeconds(slotDuration) * slotWidth * (isRtl() ? -1 : 1);
        }
    }

    // Events reposition
    let refs = [];
    function reposition() {
        runReposition(refs, chunks);
    }
    $effect(reposition);
</script>

<section
    bind:this={mainState.mainEl}
    class="{theme.main}"
    style:--ec-grid-cols="{grid[0].length}"
    style:--ec-grid-rows="{grid.length > 1 ? `repeat(${grid.length - 1}, auto)` : ''} 1fr"
    style:--ec-col-width="{columnWidth ?? 'minmax(4em, 1fr)'}"
    style:--ec-slot-label-periodicity="{slotLabelPeriodicity}"
    style:--ec-slot-height="{slotHeight}px"
    style:--ec-slot-width="{slotWidth}px"
    style:--ec-header-height="{headerHeight}px"
    style:--ec-sidebar-width="{sidebarWidth}px"
    {@attach resizeObserver(reposition)}
>
    <header bind:offsetHeight={headerHeight} class="{theme.header}">
        <aside class="{theme.sidebar}" bind:offsetWidth={viewState.sidebarWidth}></aside>
        <div class="{theme.grid}" role="row">
            {#each grid[0] as {dayStart: date, disabled, highlight}, i}
                <ColHead {date} colIndex={1 + i} {disabled} {highlight}>
                    <DayHeader {date}/>
                </ColHead>
            {/each}
            {#if !monthView}
                {#each grid[0] as {dayStart: date, disabled, highlight}}
                    <ColHead {date} className={theme.slots} {disabled} {highlight} ariaHidden>
                        {#each daySlots[date.getTime()] as slot}
                            <div
                                class="{theme.slot}"
                                style:--ec-slot-label-periodicity={slot[2]}
                            >
                                <time
                                    datetime="{slot[0]}"
                                    {@attach contentFrom(slot[1])}
                                ></time>
                            </div>
                        {/each}
                    </ColHead>
                {/each}
            {/if}
        </div>
    </header>

    <div class="{theme.body}" role="rowgroup">
        <aside class="{theme.sidebar}">
            {#each viewResources as resource}
                <div class="{theme.rowHead}" role="rowheader">
                    {#if nestedResources}
                        <Expander {resource} />
                    {/if}
                    <Label {resource}/>
                </div>
            {/each}
        </aside>
        <div class="{theme.grid}" role="row">
            {#each grid as days, i}
                {#each days as day, j}
                    <Day {day} noIeb={j + 1 === days.length} noBeb={i + 1 === grid.length}/>
                {/each}
            {/each}
        </div>
        <div class="{theme.events}">
            {#each chunks as chunk, i (chunk.id)}
                <!-- svelte-ignore binding_property_non_reactive -->
                <Event bind:this={refs[i]} {chunk}/>
            {/each}
            {#each bgChunks as chunk (chunk.id)}
                <Event {chunk}/>
            {/each}
            {#each iChunks as chunk}
                <Event {chunk}/>
            {/each}
        </div>
    </div>

    {#if nowIndicator && !monthView}
        <NowIndicator/>
    {/if}
</section>
