<script>
    import {getContext} from 'svelte';
    import {addDay, cloneDate, toViewWithLocalDates, setContent, bgEvent, isFunction} from '#lib';
    import Day from './Day.svelte';

    let {_bodyEl, _events, _view, _viewDates, noEventsClick, noEventsContent, theme} = getContext('state');

    let noEvents = $derived.by(() => {
        let noEvents = true;
        if ($_viewDates.length) {
            let start = $_viewDates[0];
            let end = addDay(cloneDate($_viewDates.at(-1)));
            for (let event of $_events) {
                if (!bgEvent(event.display) && event.start < end && event.end > start) {
                    noEvents = false;
                    break;
                }
            }
        }
        return noEvents;
    });

    let content = $derived(isFunction($noEventsContent) ? $noEventsContent() : $noEventsContent);

    function onclick(jsEvent) {
        if (isFunction($noEventsClick)) {
            $noEventsClick({jsEvent, view: toViewWithLocalDates($_view)});
        }
    }
</script>

<div bind:this={$_bodyEl} class="{$theme.body}">
    <div class="{$theme.content}">
        {#if noEvents}
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div use:setContent={content} class="{$theme.noEvents}" {onclick}></div>
        {:else}
            {#each $_viewDates as date}
                <Day {date}/>
            {/each}
        {/if}
    </div>
</div>
