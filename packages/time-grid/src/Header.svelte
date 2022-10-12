<script>
    import {getContext} from 'svelte';
    import {setContent} from '@event-calendar/common';
    import {createAllDayContent} from './utils.js';

    export let allDay = false;

    let {_scrollable, allDayContent, theme} = getContext('state');
    let {_times} = getContext('view-state');

    let allDayText;
    $: allDayText = createAllDayContent($allDayContent);
</script>

<div class="{allDay ? $theme.allDay : $theme.header}{$_scrollable ? ' ' + $theme.withScroll : ''}">
    <div class="{$theme.sidebar}">
        <div class="{$theme.sidebarTitle}" use:setContent={allDayText}></div>
        <div class="{$theme.hiddenTimes}">
            {#each $_times as time}
                <div class="{$theme.time}">{time}</div>
            {/each}
        </div>
    </div>
    <div class="{$theme.days}">
        <div class="{$theme.lines}"></div>
        <slot></slot>
    </div>
    <div class="{$theme.hiddenScroll}"></div>
</div>