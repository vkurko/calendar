<script>
    import {getContext, untrack} from 'svelte';
    import {observeResize} from '#lib';
    import Section from './Section.svelte';

    let {children} = $props();

    let {
        _bodyEl, _viewDates, _slotTimeLimits, _times, _recheckScrollable, scrollTime, slotDuration, slotHeight, theme
    } = getContext('state');

    let el = $state();

    $effect(() => {
        $_bodyEl = el;
    });

    $effect(() => {
        $_viewDates;
        $scrollTime;
        untrack(scrollToTime);
    });

    function scrollToTime() {
        el.scrollTop = (($scrollTime.seconds - $_slotTimeLimits.min.seconds) / $slotDuration.seconds - 0.5) * $slotHeight;
    }
</script>

<div
    bind:this={el}
    class="{$theme.body}"
    use:observeResize={() => $_recheckScrollable = true}
>
    <div class="{$theme.content}">
        <Section {children}>
            {#snippet lines()}
                {#each $_times as time}
                    <div class="{$theme.line}{time[2] ? '' : ' ' + $theme.minor}"></div>
                {/each}
            {/snippet}
        </Section>
    </div>
</div>
