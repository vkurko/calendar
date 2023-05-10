<script>
    import {getContext, onMount} from 'svelte';
    import Section from './Section.svelte';

    let {_bodyEl, _viewDates, scrollTime, slotDuration, slotHeight, theme} = getContext('state');
    let {_slotTimeLimits, _times} = getContext('view-state');

    let el;
    let compact;
    let lines = [];
    let timeLimitMin;

    $: $_bodyEl = el;

    $: {
        compact = $slotDuration.seconds >= 3600;
        lines.length = $_times.length;
        // Use intermediate variable so that changes in _slotTimeLimits do not trigger setting the el.scrollTop
        timeLimitMin = $_slotTimeLimits.min.seconds;
    }

    $: if (el && $_viewDates) {
        scrollToTime()
    }

    function scrollToTime() {
        el.scrollTop = (($scrollTime.seconds - timeLimitMin) / $slotDuration.seconds - 0.5) * $slotHeight;
    }
</script>

<div
    bind:this={el}
    class="{$theme.body}{compact ? ' ' + $theme.compact : ''}"
>
    <div class="{$theme.content}">
        <Section>
            <svelte:fragment slot="lines">
                {#each lines as line}
                    <div class="{$theme.line}"></div>
                {/each}
            </svelte:fragment>
            <slot></slot>
        </Section>
    </div>
</div>
