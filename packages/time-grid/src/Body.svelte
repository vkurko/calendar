<script>
    import {getContext} from 'svelte';
    import {hasYScroll, setContent} from '@event-calendar/common';
    import {createAllDayContent} from './utils.js';

    let {_intlSlotLabel, _viewDates, scrollTime, _scrollable, _scroll,
        allDayContent, slotDuration, slotHeight, theme} = getContext('state');
    let {_slotTimeLimits, _times} = getContext('view-state');

    let el;
    let compact;
    let lines = [];
    let timeLimitMin;

    $: {
        compact = $slotDuration.seconds >= 3600;
        lines.length = $_times.length;
        // Use intermediate variable so that changes in _slotTimeLimits do not trigger setting the el.scrollTop
        timeLimitMin = $_slotTimeLimits.min.seconds;
    }

    let allDayText;
    $: allDayText = createAllDayContent($allDayContent);

    $: if (el && $_viewDates) {
        el.scrollTop = (($scrollTime.seconds - timeLimitMin) / $slotDuration.seconds - 0.5) * $slotHeight;
    }

    $: if (el && $_times && $slotDuration) {
        setTimeout(recheckScrollable);
    }

    function recheckScrollable() {
        $_scrollable = hasYScroll(el);
    }
</script>

<div
    bind:this={el}
    class="{$theme.body}{compact ? ' ' + $theme.compact : ''}"
    on:scroll={$_scroll}
>
    <div class="{$theme.content}">
        <div class="{$theme.sidebar}">
            <div class="{$theme.sidebarTitle}" use:setContent={allDayText}></div>
            {#each $_times as time}
                <div class="{$theme.time}">{time}</div>
            {/each}
        </div>
        <div class="{$theme.days}">
            <div class="{$theme.lines}">
                {#each lines as line}
                    <div class="{$theme.line}"></div>
                {/each}
            </div>
            <slot></slot>
        </div>
    </div>
</div>

<svelte:window on:resize={recheckScrollable}/>