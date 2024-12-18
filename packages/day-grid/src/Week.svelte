<script>
    import {getContext, tick} from 'svelte';
    import {cloneDate, addDay, eventIntersects, bgEvent, createEventChunk, prepareEventChunks,
        runReposition, debounce, setContent, isFunction} from '@event-calendar/core';
    import Day from './Day.svelte';

    export let dates;

    let {_events, _iEvents, _queue2, _hiddenEvents,
        resources, filterEventsWithResources, hiddenDays, theme,
        weekNumbers, weekNumbersLabelContent} = getContext('state');

    let chunks, bgChunks, longChunks, iChunks = [];

    let start;
    let end;
    let refs = [];

    let style;
    let weekNumberLabelContent;

    function calculateWeekNumber(date) {
         // Get the year of the given date
        const year = date.getFullYear();

        /*
           If 1 January falls on a Monday, Tuesday, Wednesday or Thursday, then the week of 1 January is Week 1. Except in the case of 1 January falling on a Monday, this Week 1 includes the last day(s) of the previous year.
           If 1 January falls on a Friday, Saturday, or Sunday, then 1 January is considered to be part of the last week of the previous year. Week 1 will begin on the first Monday after 1 January.
        */
        const jan1 = new Date(year, 0, 1);
        const jan1Day = jan1.getDay();

        let week1Start;

        if (jan1Day >= 1 && jan1Day <= 4) { // Monday to Thursday
            week1Start = jan1; // Week 1 starts on January 1st
        } else { // Friday to Sunday
            const daysToMonday = (8 - jan1Day) % 7; // Days to next Monday
            week1Start = new Date(year, 0, 1 + daysToMonday);
        }

        // Calculate the number of milliseconds in a week
        const oneWeekMs = 7 * 24 * 60 * 60 * 1000;

        // Calculate the difference in time between the input date and Week 1 start
        const diffMs = date - week1Start;

        // If the input date is before Week 1 start, calculate its week in the previous year
        if (diffMs < 0) {
            return calculateWeekNumber(new Date(year - 1, 11, 31));
        }

        // Calculate the week number (adding 1 to account for the first week)
        const weekNumber = Math.floor(diffMs / oneWeekMs) + 1;

        return weekNumber;
    }


    $: {
        if (!$weekNumbers) {
            style = 'visibility:hidden;';
        }
    }

    $: {
        start = dates[0];
        end = addDay(cloneDate(dates.at(-1)));
    }

    let debounceHandle = {};
    function reposition() {
        debounce(() => runReposition(refs, dates), debounceHandle, _queue2);
    }

    $: {
        chunks = [];
        bgChunks = [];
        for (let event of $_events) {
            if (eventIntersects(event, start, end, $filterEventsWithResources ? $resources : undefined)) {
                let chunk = createEventChunk(event, start, end);
                if (bgEvent(event.display)) {
                    if (event.allDay) {
                        bgChunks.push(chunk);
                    }
                } else {
                    chunks.push(chunk);
                }
            }
        }
        prepareEventChunks(bgChunks, $hiddenDays);
        longChunks = prepareEventChunks(chunks, $hiddenDays);
        // Run reposition only when events get changed
        reposition();
    }

    $: iChunks = $_iEvents.map(event => {
        let chunk;
        if (event && eventIntersects(event, start, end)) {
            chunk = createEventChunk(event, start, end);
            prepareEventChunks([chunk], $hiddenDays);
        } else {
            chunk = null;
        }
        return chunk;
    });

    $: if ($_hiddenEvents) {
        // Schedule reposition during next update
        tick().then(reposition);
    }


    $: {
        let weekNumber = calculateWeekNumber(end);

        if ($weekNumbersLabelContent) {
        weekNumberLabelContent = isFunction($weekNumbersLabelContent)
            ? $weekNumbersLabelContent({ weekNumber })
            : $weekNumbersLabelContent;
        } else {
            weekNumberLabelContent = 'W: ' + weekNumber;
        }
    }
</script>

<div class="{$theme.days}" role="row">
    {#each dates as date, i}
        <Day {date} {chunks} {bgChunks} {longChunks} {iChunks} {dates} bind:this={refs[i]} />
    {/each}

    <span
        class="{$theme.weekNumber}"
        {style}
        use:setContent={weekNumberLabelContent}
    >
    </span>
</div>

<svelte:window on:resize={reposition}/>
