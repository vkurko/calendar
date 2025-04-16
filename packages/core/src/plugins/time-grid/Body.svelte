<script>
    import {getContext, untrack} from 'svelte';
    import {observeResize} from '#lib';
    import Section from './Section.svelte';

    let {children} = $props();

    let {
        _bodyEl, _viewDates, _slotTimeLimits, _times, _recheckScrollable, scrollTime, slotDuration, slotHeight, theme
    } = getContext('state');

    let el = $state();

    let compact = $derived($slotDuration.seconds >= 3600);

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
    class="{$theme.body}{compact ? ' ' + $theme.compact : ''}"
    use:observeResize={() => $_recheckScrollable = true}
>
    <div class="{$theme.content}">
        <Section {children}>
            {#snippet lines()}
                {#each new Array($_times.length) as line}
                    <div class="{$theme.line}"></div>
                {/each}
            {/snippet}
        </Section>
    </div>
</div>
