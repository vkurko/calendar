<script>
    import {getContext} from 'svelte';
    import {
        contentFrom, getWeekNumber, isFunction, keyEnter, toISOString, toLocalDate, stopPropagation
    } from '#lib';
    import {BaseDay} from '#components';

    let {day} = $props();

    let {
        date, firstDay, moreLinkContent, theme, weekNumbers, weekNumberContent, _hiddenChunks, _intlDayCell, _popupDay
    } = getContext('state');

    let {dayStart, disabled, highlight} = $derived(day);
    let otherMonth = $derived(dayStart.getUTCMonth() !== $date.getUTCMonth());
    let classes = $derived(classNames => [...classNames, otherMonth && $theme.otherMonth]);

    // Week numbers
    let showWeekNumber = $derived($weekNumbers && dayStart.getUTCDay() === ($firstDay ? 1 : 0));
    let weekNumber = $derived.by(() => {
        let weekNumber;
        if (showWeekNumber) {
            let week = getWeekNumber(dayStart, $firstDay);
            if ($weekNumberContent) {
                weekNumber = isFunction($weekNumberContent)
                    ? $weekNumberContent({date: toLocalDate(dayStart), week})
                    : $weekNumberContent;
            } else {
                weekNumber = 'W' + String(week).padStart(2, '0');
            }
        }
        return weekNumber;
    });

    // More link
    let hiddenChunks = $derived($_hiddenChunks[dayStart.getTime()]);
    let moreLink = $derived.by(() => {
        let moreLink = '';
        if (hiddenChunks) {
            let text = '+' + hiddenChunks.length + ' more';
            if ($moreLinkContent) {
                moreLink = isFunction($moreLinkContent)
                    ? $moreLinkContent({num: hiddenChunks.length, text})
                    : $moreLinkContent;
            } else {
                moreLink = text;
            }
        }
        return moreLink;
    });

    // Popup
    function showMore() {
        $_popupDay = day;
    }
</script>

<BaseDay date={dayStart} allDay {classes} {disabled} {highlight}>
    <div class="{$theme.dayHead}">
        <time
            datetime="{toISOString(dayStart, 10)}"
            {@attach contentFrom($_intlDayCell.format(dayStart))}
        ></time>
        {#if showWeekNumber}
            <span
                class="{$theme.weekNumber}"
                {@attach contentFrom(weekNumber)}
            ></span>
        {/if}
    </div>

    <div class="{$theme.dayFoot}">
        {#if hiddenChunks}
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
                {@attach contentFrom(moreLink)}
            ></a>
        {/if}
    </div>
</BaseDay>
