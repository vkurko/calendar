<script>
    import {getContext, tick} from 'svelte';
    import {createDate, cloneDate, setContent, setMidnight, nextDate, prevDate, outsideRange} from '#lib';

    export let buttons;

    let {
        _currentRange, _viewTitle, _viewDates, buttonText, customButtons, date, duration, hiddenDays, theme, validRange,
        view
    } = getContext('state');

    let today = setMidnight(createDate());
    let prevDisabled, nextDisabled, todayDisabled;

    let running = false;
    function isRunning() {
        return running;
    }
    $: if (!isRunning()) {
        running = true;
        prevDisabled = false;
        nextDisabled = false;
        if ($validRange.start) {
            let currentDate = cloneDate($date);
            $date = prevDate($date, $duration, $hiddenDays);
            prevDisabled = test();
            $date = currentDate;
        }
        if ($validRange.end) {
            let currentDate = cloneDate($date);
            $date = nextDate($date, $duration);
            nextDisabled = test();
            $date = currentDate;
        }
        todayDisabled = today >= $_currentRange.start && today < $_currentRange.end;
        if (!todayDisabled && ($validRange.start || $validRange.end)) {
            let currentDate = cloneDate($date);
            $date = cloneDate(today);
            todayDisabled = test();
            $date = currentDate;
        }
        tick().then(() => running = false);
    }

    function test() {
        return $_viewDates.every(date => outsideRange(date, $validRange));
    }

    function prev() {
        $date = prevDate($date, $duration, $hiddenDays);
    }

    function next() {
        $date = nextDate($date, $duration);
    }
</script>

{#each buttons as button}
    {#if button == 'title'}
        <!-- svelte-ignore a11y-missing-content -->
        <h2 class="{$theme.title}" use:setContent={$_viewTitle}></h2>
    {:else if button == 'prev'}
        <button
            class="{$theme.button} ec-{button}"
            aria-label={$buttonText.prev}
            title={$buttonText.prev}
            on:click={prev}
            disabled={prevDisabled}
        ><i class="{$theme.icon} ec-{button}"></i></button>
    {:else if button == 'next'}
        <button
            class="{$theme.button} ec-{button}"
            aria-label={$buttonText.next}
            title={$buttonText.next}
            on:click={next}
            disabled={nextDisabled}
        ><i class="{$theme.icon} ec-{button}"></i></button>
    {:else if button == 'today'}
        <button
            class="{$theme.button} ec-{button}"
            on:click={() => $date = cloneDate(today)}
            disabled={todayDisabled}
        >{$buttonText[button]}</button>
    {:else if $customButtons[button]}
        <!-- svelte-ignore a11y_consider_explicit_label -->
        <button
            class="{$theme.button} ec-{button}{$customButtons[button].active ? ' ' + $theme.active : ''}"
            on:click={$customButtons[button].click}
            use:setContent={$customButtons[button].text}
        ></button>
    {:else if button != ''}
        <button
            class="{$theme.button}{$view === button ? ' ' + $theme.active : ''} ec-{button}"
            on:click={() => $view = button}
        >{$buttonText[button]}</button>
    {/if}
{/each}
