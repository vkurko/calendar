<script>
    import {getContext} from 'svelte';
    import {
        contentFrom, createContent, createWeekNumberContent, getWeekNumber, keyEnter, toISOString, stopPropagation
    } from '#lib';
    import {BaseDay} from '#components';

    let {day, noIeb, noBeb} = $props();

    let mainState = getContext('state');
    let viewState = getContext('view-state');

    let {features, snippets, options: {date, firstDay, moreLinkContent, theme, weekNumbers, weekNumberContent}} = $derived(mainState);
    let {hiddenChunks, intlDayCell} = $derived(viewState);

    let {dayStart, disabled, highlight} = $derived(day);
    let otherMonth = $derived(dayStart.getUTCMonth() !== date.getUTCMonth());
    let classes = $derived(classNames => [...classNames, otherMonth && theme.otherMonth]);

    // Week numbers
    let showWeekNumber = $derived(weekNumbers && dayStart.getUTCDay() === (firstDay ? 1 : 0));
    let weekNumber = $derived(showWeekNumber
        ? createWeekNumberContent(
            getWeekNumber(dayStart, firstDay), dayStart, weekNumberContent, snippets.weekNumberContent
        )
        : {}
    );

    // More link
    let dayHiddenChunks = $derived(hiddenChunks.get(dayStart.getTime()));
    let moreLink = $derived.by(() => {
        if (!dayHiddenChunks) {
            return {};
        }
        let num = dayHiddenChunks.length;
        let text = '+' + num + ' more';
        return createContent(moreLinkContent, () => ({num, text}), text, snippets.moreLinkContent);
    });

    // Popup
    function showMore() {
        viewState.popupDay = day;
    }
</script>

<BaseDay
    date={dayStart}
    allDay
    {classes}
    {disabled}
    {highlight}
    {noIeb}
    {noBeb}
    defaultContent={() => intlDayCell.format(dayStart)}
>
    {#snippet content(dayCell)}
        <div class="{theme.dayHead}">
            <time
                datetime="{toISOString(dayStart, 10)}"
                {@attach contentFrom(dayCell.content, dayCell.snippet)}
            >{@render dayCell.snippet?.(dayCell.arg)}</time>
            {#if showWeekNumber}
                <span
                    class="{theme.weekNumber}"
                    {@attach contentFrom(weekNumber.content, weekNumber.snippet)}
                >{@render weekNumber.snippet?.(weekNumber.arg)}</span>
            {/if}
        </div>

        <div class="{theme.dayFoot}">
            {#if dayHiddenChunks}
                <!-- svelte-ignore a11y_missing_attribute -->
                <!-- svelte-ignore a11y_missing_content -->
                <!-- svelte-ignore a11y_consider_explicit_label -->
                <a
                    role="button"
                    tabindex="0"
                    aria-haspopup="dialog"
                    onclick={stopPropagation(showMore)}
                    onkeydown={keyEnter(showMore)}
                    onpointerdown={stopPropagation()}
                    {@attach contentFrom(moreLink.content, moreLink.snippet)}
                >{@render moreLink.snippet?.(moreLink.arg)}</a>
            {/if}
        </div>
    {/snippet}
</BaseDay>
