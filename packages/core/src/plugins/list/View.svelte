<script>
    import {getContext, setContext} from 'svelte';
    import {addDay, cloneDate, contentFrom, bgEvent, isFunction, toViewWithLocalDates} from '#lib';
    import ViewState from './state.svelte.js';
    import Day from './Day.svelte';

    let mainState = getContext('state');
    let viewState = new ViewState(mainState);
    setContext('view-state', viewState);

    let {filteredEvents, view, viewDates, options: {noEventsClick, noEventsContent, theme}} = $derived(mainState);

    let noEvents = $derived.by(() => {
        let noEvents = true;
        if (viewDates.length) {
            let start = viewDates[0];
            let end = addDay(cloneDate(viewDates.at(-1)));
            for (let event of filteredEvents) {
                if (!bgEvent(event.display) && event.start < end && event.end > start) {
                    noEvents = false;
                    break;
                }
            }
        }
        return noEvents;
    });

    let content = $derived(isFunction(noEventsContent) ? noEventsContent() : noEventsContent);

    function onclick(jsEvent) {
        if (isFunction(noEventsClick)) {
            noEventsClick({jsEvent, view: toViewWithLocalDates(view)});
        }
    }
</script>

<section bind:this={mainState.mainEl} class="{theme.main}">
    {#if noEvents}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div {@attach contentFrom(content)} class="{theme.noEvents}" {onclick}></div>
    {:else}
        {#each viewDates as date}
            <Day {date}/>
        {/each}
    {/if}
</section>
