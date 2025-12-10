<script>
    import {getContext, tick, untrack} from 'svelte';
    import {cloneDate, contentFrom, nextDate, prevDate, outsideRange} from '#lib';

    let {buttons} = $props();

    let {
        _currentRange, _today, _viewTitle, _viewDates, buttonText, customButtons, date, duration, hiddenDays, theme,
        validRange, view
    } = getContext('state');

    let prevDisabled = $state(false);
    let nextDisabled = $state(false);
    let todayDisabled = $state(false);

    let running = false;
    $effect.pre(() => {
        $_viewDates;
        $validRange;
        buttons;
        untrack(() => {
            if (!running) {
                running = true;
                if (buttons.includes('prev')) {
                    prevDisabled = false;
                    if ($validRange.start) {
                        prevDisabled = test(prev);
                    }
                }
                if (buttons.includes('next')) {
                    nextDisabled = false;
                    if ($validRange.end) {
                        nextDisabled = test(next);
                    }
                }
                if (buttons.includes('today')) {
                    todayDisabled = $_today >= $_currentRange.start && $_today < $_currentRange.end;
                    if (!todayDisabled && ($validRange.start || $validRange.end)) {
                        todayDisabled = test(today);
                    }
                }
                tick().then(() => running = false);
            }
        });
    });

    function test(fn) {
        let currentDate = cloneDate($date);
        fn();
        let result = $_viewDates.every(date => outsideRange(date, $validRange));
        $date = currentDate;
        return result;
    }

    function prev() {
        $date = prevDate($date, $duration, $hiddenDays);
    }

    function next() {
        $date = nextDate($date, $duration);
    }

    function today() {
        $date = cloneDate($_today);
    }
</script>

{#each buttons as button}
    {#if button === 'title'}
        <!-- svelte-ignore a11y_missing_content -->
        <h2 class="{$theme.title}" {@attach contentFrom($_viewTitle)}></h2>
    {:else if button === 'prev'}
        <button
            class="{$theme.button} ec-{button}"
            aria-label={$buttonText.prev}
            title={$buttonText.prev}
            onclick={prev}
            disabled={prevDisabled}
        ><i class="{$theme.icon} ec-{button}"></i></button>
    {:else if button === 'next'}
        <button
            class="{$theme.button} ec-{button}"
            aria-label={$buttonText.next}
            title={$buttonText.next}
            onclick={next}
            disabled={nextDisabled}
        ><i class="{$theme.icon} ec-{button}"></i></button>
    {:else if button === 'today'}
        <button
            class="{$theme.button} ec-{button}"
            onclick={today}
            disabled={todayDisabled}
        >{$buttonText[button]}</button>
    {:else if $customButtons[button]}
        <!-- svelte-ignore a11y_consider_explicit_label -->
        <button
            class={[$theme.button, `ec-${button}`, $customButtons[button].active && $theme.active]}
            onclick={$customButtons[button].click}
            {@attach contentFrom($customButtons[button].text)}
        ></button>
    {:else if button !== ''}
        <button
            class={[$theme.button, `ec-${button}`, $view === button && $theme.active]}
            onclick={() => $view = button}
        >{$buttonText[button]}</button>
    {/if}
{/each}
