<script>
    import {getContext} from 'svelte';
    import {setContent} from '@event-calendar/core';

    let {theme, _intlDayHeader, _days} = getContext('state');
</script>

<div class="{$theme.header}">
    <div class="{$theme.days}">
        {#each $_days as day}
            <div class="{$theme.day}" use:setContent={$_intlDayHeader.format(day)}></div>
        {/each}
    </div>
    <div class="{$theme.hiddenScroll}"></div>
</div>
