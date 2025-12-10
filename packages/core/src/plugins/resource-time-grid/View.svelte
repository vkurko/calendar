<script>
    import {getContext} from 'svelte';
    import {createGrid} from './lib.js';
    import {ColHead, DayHeader} from '#components';
    import Label from './Label.svelte';
    import View from '../time-grid/View.svelte';

    let {_viewDates, _viewResources, _slotTimeLimits, datesAboveResources, highlightedDates, validRange, theme} = getContext('state');

    let resourceLabels = $state([]);
</script>

<View
    createGridFn={() => createGrid(
        $_viewDates, $_viewResources, $_slotTimeLimits, $datesAboveResources, $validRange, $highlightedDates
    )}
    fullwidthNowIndicator={$datesAboveResources}
>
    {#snippet header(grid)}
        {#each grid as days, i}
            {@const {dayStart: date, resource, disabled, highlight} = days[0]}
            <ColHead
                {date}
                className={$theme.colGroup}
                weekday={$datesAboveResources}
                colSpan={days.length}
                colIndex={1 + i * days.length}
                disabled={$datesAboveResources && disabled}
                highlight={$datesAboveResources && highlight}
            >
                {#if $datesAboveResources}
                    <DayHeader {date}/>
                {:else}
                    <Label {resource} setLabel={label => resourceLabels[i] = label + ', '}/>
                {/if}
            </ColHead>
        {/each}
        {#each grid as days, i}
            {#each days as day, j}
                {@const {dayStart: date, resource, disabled, highlight} = day}
                <ColHead {date} colIndex={1 + j + i * days.length} {disabled} {highlight}>
                    {#if $datesAboveResources}
                        <Label {resource} {date}/>
                    {:else}
                        <DayHeader {date} alPrefix={resourceLabels[i]}/>
                    {/if}
                </ColHead>
            {/each}
        {/each}
    {/snippet}
</View>
