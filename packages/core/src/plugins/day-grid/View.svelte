<script>
    import {getContext, setContext, tick} from 'svelte';
    import {contentFrom, empty, length, resizeObserver, runReposition} from '#lib';
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

{#if !empty(grid) && !empty(grid[0])}
    <section
        bind:this={mainState.mainEl}
        class={[theme.main, dayMaxEvents === true && theme.uniform]}
        style:--ec-grid-cols="{length(grid[0])}"
        style:--ec-grid-rows="{length(grid)}"
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
                        <Day {day} noIeb={j + 1 === length(days)} noBeb={i + 1 === length(grid)}/>
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
