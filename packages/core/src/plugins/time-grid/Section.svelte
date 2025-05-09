<script>
    import {getContext} from 'svelte';
    import {setContent} from '#lib';
    import {createAllDayContent} from './utils.js';

    let {children, lines} = $props();

    let {allDayContent, slotLabelInterval, theme, _times} = getContext('state');

    let allDayText = $derived(createAllDayContent($allDayContent));
    let showAllTimes = $derived($slotLabelInterval && $slotLabelInterval.seconds <= 0);
</script>

<div class="{$theme.sidebar}">
    <div class="{$theme.sidebarTitle}" use:setContent={allDayText}></div>
    {#each $_times as time, i}
        <time
            class="{$theme.time}{(i || showAllTimes) && time[2] ? '' : ' ' + $theme.minor}"
            datetime="{time[0]}"
            use:setContent={time[1]}
        ></time>
    {/each}
</div>
<div class="{$theme.days}" role="row">
    <div class="{$theme.lines}">{#if lines}{@render lines()}{/if}</div>
    {#if children}
        {@render children()}
    {/if}
</div>
