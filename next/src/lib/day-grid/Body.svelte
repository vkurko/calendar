<script>
    import {getContext} from 'svelte';
    import Week from './Week.svelte';

    let {_bodyEl, _viewDates, _hiddenEvents, dayMaxEvents, hiddenDays, theme} = getContext('state');

    let days = $derived(7 - $hiddenDays.length);
    let weeks = $derived.by(() => {
        let weeks = [];
        $dayMaxEvents;
        for (let i = 0; i < $_viewDates.length / days; ++i) {
            let dates = [];
            for (let j = 0; j < days; ++j) {
                dates.push($_viewDates[i * days + j]);
            }
            weeks.push(dates);
        }
        return weeks;
    });

    $effect(() => {
        weeks;
        $_hiddenEvents = {};
    });
</script>

<div
    bind:this={$_bodyEl}
    class="{$theme.body}{$dayMaxEvents === true ? ' ' + $theme.uniform : ''}"
>
    <div class="{$theme.content}">
        {#each weeks as dates}
            <Week {dates}/>
        {/each}
    </div>
</div>
