<script>
    import {getContext} from 'svelte';
    import {setContent} from '@event-calendar/core';
    import {createAllDayContent} from './utils.js';

    let {allDayContent, theme, _times} = getContext('state');

    let allDayText;
    $: allDayText = createAllDayContent($allDayContent);
</script>

<div class="{$theme.sidebar}">
    <div class="{$theme.sidebarTitle}" use:setContent={allDayText}></div>
    {#each $_times as time}
        <time class="{$theme.time}" datetime="{time[0]}" use:setContent={time[1]}></time>
    {/each}
</div>
<div class="{$theme.days}" role="row">
    <div class="{$theme.lines}"><slot name="lines"></slot></div>
    <slot></slot>
</div>
