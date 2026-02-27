<script>
    import {getContext} from 'svelte';
    import {
        contentFrom, getWeekNumber, isFunction, keyEnter, toISOString, toLocalDate, stopPropagation
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
    let weekNumber = $derived.by(() => {
        let weekNumber;
        if (showWeekNumber) {
            let week = getWeekNumber(dayStart, $firstDay);
            if (weekNumberContent) {
                weekNumber = isFunction(weekNumberContent)
                    ? weekNumberContent({date: toLocalDate(dayStart), week})
                    : weekNumberContent;
            } else {
                weekNumber = 'W' + String(week).padStart(2, '0');
            }
        }
        return weekNumber;
    });

    // More link
    let dayHiddenChunks = $derived(hiddenChunks.get(dayStart.getTime()));
    let moreLink = $derived.by(() => {
        let moreLink = '';
        if (dayHiddenChunks) {
            let text = '+' + dayHiddenChunks.length + ' more';
            if (moreLinkContent) {
                moreLink = isFunction(moreLinkContent)
                    ? moreLinkContent({num: dayHiddenChunks.length, text})
                    : moreLinkContent;
            } else {
                moreLink = text;
            }
        }
        return moreLink;
    });

    // Popup
    function showMore() {
        viewState.popupDay = day;
    }
</script>

<BaseDay date={dayStart} allDay {classes} {disabled} {highlight} {noIeb} {noBeb}>
    <div class="{theme.dayHead}">
        {#if features.includes('dayNumber')}
            <time
                datetime="{toISOString(dayStart, 10)}"
                {@attach contentFrom(intlDayCell.format(dayStart))}
            ></time>
        {/if}
        {#if showWeekNumber}
            <span class="{theme.weekNumber}" {@attach contentFrom(snippets.weekNumberContent ? undefined : weekNumber)}>
                {@render snippets.weekNumberContent?.({date: toLocalDate(dayStart), week: getWeekNumber(dayStart, $firstDay)})}
            </span>
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
                {@attach contentFrom(snippets.moreLinkContent ? undefined : moreLink)}
            >
                {@render snippets.moreLinkContent?.({num: dayHiddenChunks.length, text: '+' + dayHiddenChunks.length + ' more'})}
            </a>
        {/if}
    </div>
</BaseDay>
