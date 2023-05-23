<script>
    import {getContext} from 'svelte';
    import {setContent} from '@event-calendar/core';
    import {createAllDayContent} from './utils.js';

    let {allDayContent, theme} = getContext('state');
    let {_times} = getContext('view-state');

    let allDayText;
    $: allDayText = createAllDayContent($allDayContent);
</script>

<div class="{$theme.sidebar}">
    <div class="{$theme.sidebarTitle}" use:setContent={allDayText}></div>
    {#each $_times as time}
        <div class="{$theme.time}">{time}</div>
    {/each}
</div>
<div class="{$theme.days}">
    <div class="{$theme.lines}"><slot name="lines"></slot></div>
    <slot></slot>
</div>
