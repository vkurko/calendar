<script>
    import {getContext} from 'svelte';
    import {createDate, cloneDate, subtractDay, addDuration, setContent, subtractDuration, setMidnight} from './lib.js';

    export let buttons;

    let {_currentRange, _viewTitle, buttonText, date, duration, hiddenDays, theme, view} = getContext('state');

    let today = setMidnight(createDate()), isToday;

    $: isToday = today >= $_currentRange.start && today < $_currentRange.end || null;

    function prev() {
        let d = subtractDuration($date, $duration);
        if ($hiddenDays.length && $hiddenDays.length < 7) {
            while ($hiddenDays.includes(d.getUTCDay())) {
                subtractDay(d);
            }
        }
        $date = d;
    }

    function next() {
        $date = addDuration($date, $duration);
    }
</script>

{#each buttons as button}
    {#if button == 'title'}
        <!-- svelte-ignore a11y-missing-content -->
        <h2 class="{$theme.title}" use:setContent={$_viewTitle}></h2>
    {:else if button == 'prev'}
        <button class="{$theme.button} ec-{button}" aria-label={$buttonText.prev} on:click={prev}><i class="{$theme.icon} ec-{button}"></i></button>
    {:else if button == 'next'}
        <button class="{$theme.button} ec-{button}" aria-label={$buttonText.next} on:click={next}><i class="{$theme.icon} ec-{button}"></i></button>
    {:else if button == 'today'}
        <button class="{$theme.button} ec-{button}" on:click={() => $date = cloneDate(today)} disabled={isToday}>{$buttonText[button]}</button>
    {:else if button != ''}
        <button class="{$theme.button}{$view === button ? ' ' + $theme.active : ''} ec-{button}" on:click={() => $view = button}>{$buttonText[button]}</button>
    {/if}
{/each}
