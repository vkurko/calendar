<script>
    import {getContext} from 'svelte';
    import {is_function} from 'svelte/internal';
    import {addDay, cloneDate, toViewWithLocalDates, setContent, bgEvent} from '@event-calendar/core';
    import Day from './Day.svelte';

    let {_bodyEl, _events, _view, _viewDates, noEventsClick, noEventsContent, theme} = getContext('state');

    let noEvents, content;

    $: {
        noEvents = true;
        if ($_viewDates.length) {
            let start = $_viewDates[0];
            let end = addDay(cloneDate($_viewDates[$_viewDates.length - 1]));
            for (let event of $_events) {
                if (!bgEvent(event.display) && event.start < end && event.end > start) {
                    noEvents = false;
                    break;
                }
            }
        }
    }

    $: {
        content = is_function($noEventsContent) ? $noEventsContent() : $noEventsContent;
        if (typeof content === 'string') {
            content = {html: content};
        }
    }

    function handleClick(jsEvent) {
        if (is_function($noEventsClick)) {
            $noEventsClick({jsEvent, view: toViewWithLocalDates($_view)});
        }
    }
</script>

<div bind:this={$_bodyEl} class="{$theme.body}">
    <div class="{$theme.content}">
        {#if noEvents}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <div use:setContent={content} class="{$theme.noEvents}" on:click={handleClick}></div>
        {:else}
            {#each $_viewDates as date}
                <Day {date}/>
            {/each}
        {/if}
    </div>
</div>
