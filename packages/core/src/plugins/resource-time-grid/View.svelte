<script>
    import {getContext, tick} from 'svelte';
    import {ColHead, DayHeader} from '#components';
    import {datesEqual, isRtl, length} from '#lib';
    import ViewState from './state.svelte.js';
    import Label from './Label.svelte';
    import View from '../time-grid/View.svelte';
    import NowIndicator from '../time-grid/NowIndicator.svelte';

    let mainState = getContext('state');
    let viewState = new ViewState(mainState);

    let {today, mainEl, viewDates, options: {scrollTime, datesAboveResources, theme}} = $derived(mainState);
    let {grid, sidebarWidth} = $derived(viewState);

    let resourceLabels = $state([]);

    // Handle scrollTime (scroll to today)
    $effect(() => {
        if (datesAboveResources) {
            viewDates;
            scrollTime;
            tick().then(scrollToTime);
        }
    });
    function scrollToTime() {
        if (today >= viewDates[0] && today <= viewDates.at(-1)) {
            for (let days of grid) {
                let day = days[0];
                if (datesEqual(day.dayStart, today)) {
                    mainEl.scrollLeft = (mainEl.scrollWidth - sidebarWidth) / (length(grid) * length(days)) * (day.gridColumn - 1) * (isRtl() ? -1 : 1);
                    break;
                }
            }
        }
    }
</script>

<View {viewState}>
    {#snippet header()}
        {#each grid as days, i}
            {@const {dayStart: date, resource, disabled, highlight} = days[0]}
            <ColHead
                {date}
                className={length(grid[0]) > 1 ? theme.colGroup : undefined}
                weekday={datesAboveResources}
                colSpan={length(days)}
                colIndex={1 + i * length(days)}
                disabled={datesAboveResources && disabled}
                highlight={datesAboveResources && highlight}
            >
                {#if datesAboveResources}
                    <DayHeader {date}/>
                {:else}
                    <Label {resource} setLabel={label => resourceLabels[i] = label + ', '}/>
                {/if}
            </ColHead>
        {/each}
        {#if length(grid[0]) > 1}
            {#each grid as days, i}
                {#each days as day, j}
                    {@const {dayStart: date, resource, disabled, highlight} = day}
                    <ColHead {date} colIndex={1 + j + i * length(days)} {disabled} {highlight}>
                        {#if datesAboveResources}
                            <Label {resource} {date}/>
                        {:else}
                            <DayHeader {date} alPrefix={resourceLabels[i]}/>
                        {/if}
                    </ColHead>
                {/each}
            {/each}
        {/if}
    {/snippet}

    {#snippet nowIndicator()}
        {#if datesAboveResources}
            <NowIndicator days={grid.flat()} span={length(grid[0])}/>
        {:else}
            {#if length(grid[0]) > 1}
                {#each grid as days}
                    <NowIndicator {days} />
                {/each}
            {:else}
                <NowIndicator days={grid.flat()} span={length(grid)}/>
            {/if}
        {/if}
    {/snippet}
</View>
