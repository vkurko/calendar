<script>
    import {getContext, tick, untrack} from 'svelte';
    import {cloneDate, contentFrom, nextDate, prevDate, outsideRange} from '#lib';

    let {buttons} = $props();

    let mainState = getContext('state');
    let {currentRange, today, viewTitle, viewDates, options: {buttonText, customButtons, date, duration, hiddenDays,
        theme, validRange, view}} = $derived(mainState);

    let prevDisabled = $state(false);
    let nextDisabled = $state(false);
    let todayDisabled = $state(false);

    let running = false;
    $effect.pre(() => {
        viewDates;
        validRange;
        buttons;
        untrack(() => {
            if (!running) {
                running = true;
                if (buttons.includes('prev')) {
                    prevDisabled = false;
                    if (validRange.start) {
                        prevDisabled = test(prev);
                    }
                }
                if (buttons.includes('next')) {
                    nextDisabled = false;
                    if (validRange.end) {
                        nextDisabled = test(next);
                    }
                }
                if (buttons.includes('today')) {
                    todayDisabled = today >= currentRange.start && today < currentRange.end;
                    if (!todayDisabled && (validRange.start || validRange.end)) {
                        todayDisabled = test(setToday);
                    }
                }
                tick().then(() => running = false);
            }
        });
    });

    function test(fn) {
        let currentDate = date;
        fn();
        let result = viewDates.every(date => outsideRange(date, validRange));
        mainState.setOption('date', currentDate);
        return result;
    }

    function prev() {
        mainState.setOption('date', prevDate(cloneDate(date), duration, hiddenDays));
    }

    function next() {
        mainState.setOption('date', nextDate(cloneDate(date), duration, hiddenDays));
    }

    function setToday() {
        mainState.setOption('date', cloneDate(today));
    }
</script>

{#each buttons as button}
    {#if button === 'title'}
        <!-- svelte-ignore a11y_missing_content -->
        <h2 class="{theme.title}" {@attach contentFrom(viewTitle)}></h2>
    {:else if button === 'prev'}
        <button
            class="{theme.button} ec-{button}"
            aria-label={buttonText.prev}
            title={buttonText.prev}
            onclick={prev}
            disabled={prevDisabled}
        ><i class="{theme.icon} ec-{button}"></i></button>
    {:else if button === 'next'}
        <button
            class="{theme.button} ec-{button}"
            aria-label={buttonText.next}
            title={buttonText.next}
            onclick={next}
            disabled={nextDisabled}
        ><i class="{theme.icon} ec-{button}"></i></button>
    {:else if button === 'today'}
        <button
            class="{theme.button} ec-{button}"
            onclick={setToday}
            disabled={todayDisabled}
        >{buttonText[button]}</button>
    {:else if customButtons[button]}
        <!-- svelte-ignore a11y_consider_explicit_label -->
        <button
            class={[theme.button, `ec-${button}`, customButtons[button].active && theme.active]}
            onclick={customButtons[button].click}
            {@attach contentFrom(customButtons[button].text)}
        ></button>
    {:else if button !== ''}
        <button
            class={[theme.button, `ec-${button}`, view === button && theme.active]}
            onclick={() => mainState.setOption('view', button)}
        >{buttonText[button]}</button>
    {/if}
{/each}
