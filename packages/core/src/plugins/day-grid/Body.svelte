<script>
    import {getContext, untrack} from 'svelte';
    import {runReposition, observeResize} from '#lib';
    import Week from './Week.svelte';

    let {
        _bodyEl, _viewDates, _events, _hiddenEvents, _recheckScrollable, dayMaxEvents, hiddenDays, theme
    } = getContext('state');

    let refs = [];

    let days = $derived(7 - $hiddenDays.length);
    let weeks = $derived.by(() => {
        let weeks = [];
        for (let i = 0; i < $_viewDates.length / days; ++i) {
            let dates = [];
            for (let j = 0; j < days; ++j) {
                dates.push($_viewDates[i * days + j]);
            }
            weeks.push(dates);
        }
        return weeks;
    });
    $effect.pre(() => {
        weeks;
        $dayMaxEvents;
        $_hiddenEvents = {};
    });

    function reposition() {
        runReposition(refs, weeks);
    }
    $effect(() => {
        $_events;
        $_hiddenEvents;
        $dayMaxEvents;
        untrack(reposition);
    });
</script>

<div
    bind:this={$_bodyEl}
    class="{$theme.body}{$dayMaxEvents === true ? ' ' + $theme.uniform : ''}"
    use:observeResize={() => $_recheckScrollable = true}
>
    <div class="{$theme.content}">
        {#each weeks as dates, i}
            <!-- svelte-ignore binding_property_non_reactive -->
            <Week {dates} bind:this={refs[i]}/>
        {/each}
    </div>
</div>

<svelte:window on:resize={reposition}/>
