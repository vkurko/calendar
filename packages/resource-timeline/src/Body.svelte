<script>
    import {getContext} from 'svelte';
    import Days from './Days.svelte';

    let {_bodyEl, _headerEl, _sidebarEl, _dayTimes, _viewResources, _viewDates, theme} = getContext('state');

    function handleScroll() {
        $_headerEl.scrollLeft = $_bodyEl.scrollLeft;
        $_sidebarEl.scrollTop = $_bodyEl.scrollTop;
    }
</script>

<div
    bind:this={$_bodyEl}
    class="{$theme.body}"
    on:scroll={handleScroll}
>
    <div class="{$theme.content}">
        <div class="{$theme.lines}">
            {#each $_viewDates as date}
                {#each $_dayTimes[date.getTime()] as time}
                    <div class="{$theme.line}"></div>
                {/each}
            {/each}
        </div>
        {#each $_viewResources as resource}
            <Days {resource}/>
        {/each}
    </div>
</div>
