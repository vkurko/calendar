<script>
    import {getContext, setContext, tick} from 'svelte';
    import {contentFrom, resizeObserver, runReposition} from '#lib';
    import ViewState from './state.svelte.js';
    import Day from './Day.svelte';
    import Event from './Event.svelte';
    import Popup from './Popup.svelte';

    let mainState = getContext('state');
    let viewState = new ViewState(mainState);
    setContext('view-state', viewState);

    let {intlDayHeader, intlDayHeaderAL, options: {dayMaxEvents, theme}} = $derived(mainState);
    let {grid, chunks, bgChunks, iChunks, hiddenChunks, popupDay} = $derived(viewState);

    // Events reposition
    let refs = [];
    function reposition() {
        runReposition(refs, chunks);
        hiddenChunks.clear();
        tick().then(hide);
    }
    function hide() {
        hiddenChunks.size;
        refs.forEach(ref => ref?.hide());
    }
    $effect(reposition);
    $effect(hide);
</script>

{#if grid.length && grid[0].length}
    <section
        bind:this={mainState.mainEl}
        class={[theme.main, dayMaxEvents === true && theme.uniform]}
        style:--ec-grid-cols="{grid[0].length}"
        style:--ec-grid-rows="{grid.length}"
        {@attach resizeObserver(reposition)}
    >
        <header class="{theme.header}">
            <div class="{theme.grid}" role="row">
                {#each grid[0] as {dayStart}, i}
                    <div
                        class={[theme.colHead, theme.weekdays?.[dayStart.getUTCDay()]]}
                        role="columnheader"
                        aria-colindex="{1 + i}"
                    >
                        <span
                            aria-label="{intlDayHeaderAL.format(dayStart)}"
                            {@attach contentFrom(intlDayHeader.format(dayStart))}
                        ></span>
                    </div>
                {/each}
            </div>
        </header>

        <div class="{theme.body}">
            <div bind:this={viewState.gridEl} class="{theme.grid}">
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

        {#if popupDay}
            <Popup/>
        {/if}
    </section>
{/if}
