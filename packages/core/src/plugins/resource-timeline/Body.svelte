<script>
    import {getContext, untrack} from 'svelte';
    import {observeResize, runReposition, toSeconds} from '#lib';
    import {getSlotTimeLimits} from './lib.js';
    import Days from './Days.svelte';

    let {_bodyEl, _headerEl, _events, _sidebarEl, _dayTimes, _dayTimeLimits, _resHs, _viewResources, _viewDates,
        _recheckScrollable, scrollTime, slotDuration, slotWidth, theme} = getContext('state');

    let el = $state();
    let refs = [];

    $effect(() => {
        $_bodyEl = el;
    });

    function scrollToTime() {
        let slotTimeLimits = getSlotTimeLimits($_dayTimeLimits, $_viewDates[0]);
        el.scrollLeft = (toSeconds($scrollTime) - toSeconds(slotTimeLimits.min)) / toSeconds($slotDuration) * $slotWidth;
    }
    $effect(() => {
        $_viewDates;
        $scrollTime;
        untrack(scrollToTime);
    });

    function reposition() {
        $_resHs.clear();
        runReposition(refs, $_viewResources);
    }
    $effect(() => {
        $_events;
        $_viewResources;
        untrack(reposition);
    });

    function onscroll() {
        $_headerEl.scrollLeft = $_bodyEl.scrollLeft;
        $_sidebarEl.scrollTop = $_bodyEl.scrollTop;
    }
</script>

<div
    bind:this={el}
    class="{$theme.body}"
    {onscroll}
    use:observeResize={() => $_recheckScrollable = true}
>
    <div class="{$theme.content}">
        <div class="{$theme.lines}">
            {#each $_viewDates as date}
                {#each $_dayTimes[date.getTime()] as time}
                    <div class="{$theme.line}{time[2] ? '' : ' ' + $theme.minor}"></div>
                {/each}
            {/each}
        </div>
        {#each $_viewResources as resource, i}
            <!-- svelte-ignore binding_property_non_reactive -->
            <Days {resource} bind:this={refs[i]}/>
        {/each}
    </div>
</div>

<svelte:window on:resize={reposition}/>
