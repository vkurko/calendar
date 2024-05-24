<script>
    import {getContext} from 'svelte';
    import {toSeconds} from '@event-calendar/core';
    import Days from './Days.svelte';

    let {_bodyEl, _headerEl, _sidebarEl, _dayTimes, _dayTimeLimits, _viewResources, _viewDates,
        scrollTime, slotDuration, slotWidth, theme} = getContext('state');

    let el;

    $: $_bodyEl = el;

    function handleScroll() {
        $_headerEl.scrollLeft = $_bodyEl.scrollLeft;
        $_sidebarEl.scrollTop = $_bodyEl.scrollTop;
    }

    $: if (el) {
        $_viewDates;
        $scrollTime;
        scrollToTime()
    }

    function scrollToTime() {
        let slotTimeLimits = $_dayTimeLimits[$_viewDates[0].getTime()];
        if (slotTimeLimits) {
            el.scrollLeft = (toSeconds($scrollTime) - toSeconds(slotTimeLimits.min)) / toSeconds($slotDuration) * $slotWidth;
        }
    }
</script>

<div
    bind:this={el}
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
