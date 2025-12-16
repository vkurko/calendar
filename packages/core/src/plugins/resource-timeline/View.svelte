<script>
    import {getContext, tick} from 'svelte';
    import {
        max, resizeObserver, runReposition, contentFrom, toSeconds, datesEqual, min, isRtl, DAY_IN_SECONDS, addDuration,
        subtractDay, cloneDate, identity
    } from "#lib";
    import {createGrid, createEventChunks, createIEventChunks, getSlotTimeLimits} from './lib.js';
    import {ColHead, DayHeader} from '#components';
    import Day from './Day.svelte';
    import Event from './Event.svelte';
    import Label from './Label.svelte';
    import Expander from './Expander.svelte';
    import NowIndicator from './NowIndicator.svelte';

    let {_activeRangeExt, _daySlots, _dayTimeLimits, _filteredEvents, _iEvents, _mainEl, _monthView, _nestedResources, _sidebarWidth,
        _slotLabelPeriodicity, _today, _viewResources, _viewDates, columnWidth, highlightedDates, nowIndicator, scrollTime,
        slotDuration, slotHeight, slotMaxTime, slotWidth, theme, validRange} = getContext('state');

    let headerHeight = $state(0);

    let grid = $derived(createGrid($_viewDates, $_viewResources, $_dayTimeLimits, $validRange, $highlightedDates));
    let {chunks, bgChunks} = $derived(createEventChunks($_filteredEvents, grid));
    let iChunks = $derived(createIEventChunks($_iEvents, grid));

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
        return () => {
            $_activeRangeExt = identity;
        };
    });

    // Handle scrollTime
    $effect(() => {
        $_viewDates;
        $scrollTime;
        tick().then(scrollToTime);
    });
    function scrollToTime() {
        if ($_monthView) {
            return;
        }
        let scrollLeft = 0;
        let todayOutOfView = $_today < $_viewDates[0] || $_today > $_viewDates.at(-1);
        for (let date of $_viewDates) {
            let slotTimeLimits = getSlotTimeLimits($_dayTimeLimits, date);
            if (todayOutOfView || datesEqual(date, $_today)) {
                scrollLeft += max(
                    min(toSeconds($scrollTime), toSeconds(slotTimeLimits.max)) - toSeconds(slotTimeLimits.min),
                    0
                );
                break;
            } else {
                scrollLeft += toSeconds(slotTimeLimits.max) - toSeconds(slotTimeLimits.min);
            }
        }
        $_mainEl.scrollLeft = scrollLeft / toSeconds($slotDuration) * $slotWidth * (isRtl() ? -1 : 1);
    }

    // Events reposition
    let refs = [];
    function reposition() {
        runReposition(refs, chunks);
    }
    $effect(reposition);
</script>

<section
    bind:this={$_mainEl}
    class="{$theme.main}"
    style:--ec-grid-cols="{grid[0].length}"
    style:--ec-grid-rows="{grid.length > 1 ? `repeat(${grid.length - 1}, auto)` : ''} minmax(auto, 1fr)"
    style:--ec-col-width="{$columnWidth ?? 'minmax(4em, 1fr)'}"
    style:--ec-slot-label-periodicity="{$_slotLabelPeriodicity}"
    style:--ec-slot-height="{$slotHeight}px"
    style:--ec-slot-width="{$slotWidth}px"
    style:--ec-header-height="{headerHeight}px"
    style:--ec-sidebar-width="{$_sidebarWidth}px"
    {@attach resizeObserver(reposition)}
>
    <header bind:offsetHeight={headerHeight} class="{$theme.header}">
        <aside class="{$theme.sidebar}" bind:offsetWidth={$_sidebarWidth}></aside>
        <div class="{$theme.grid}" role="row">
            {#each grid[0] as {dayStart: date, disabled, highlight}, i}
                <ColHead {date} colIndex={1 + i} {disabled} {highlight}>
                    <DayHeader {date}/>
                </ColHead>
            {/each}
            {#if !$_monthView}
                {#each grid[0] as {dayStart: date, disabled, highlight}}
                    <ColHead {date} className={$theme.slots} {disabled} {highlight} ariaHidden>
                        {#each $_daySlots[date.getTime()] as slot}
                            <div
                                class="{$theme.slot}"
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

    <div class="{$theme.body}" role="rowgroup">
        <aside class="{$theme.sidebar}">
            {#each $_viewResources as resource}
                <div class="{$theme.rowHead}" role="rowheader">
                    {#if $_nestedResources}
                        <Expander {resource} />
                    {/if}
                    <Label {resource}/>
                </div>
            {/each}
        </aside>
        <div class="{$theme.grid}" role="row">
            {#each grid as days, i}
                {#each days as day, j}
                    <Day {day} noIeb={j + 1 === days.length} noBeb={i + 1 === grid.length}/>
                {/each}
            {/each}
        </div>
        <div class="{$theme.events}">
            {#each chunks as chunk, i}
                <!-- svelte-ignore binding_property_non_reactive -->
                <Event bind:this={refs[i]} {chunk}/>
            {/each}
            {#each bgChunks as chunk}
                <Event {chunk}/>
            {/each}
            {#each iChunks as chunk}
                <Event {chunk}/>
            {/each}
        </div>
    </div>

    {#if $nowIndicator && !$_monthView}
        <NowIndicator {grid} />
    {/if}
</section>
