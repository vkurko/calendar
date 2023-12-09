<script>
    import {getContext} from 'svelte';
    import {setContent, toISOString} from '@event-calendar/core';
    import Section from './Section.svelte';
    import Body from './Body.svelte';
    import Day from './Day.svelte';
    import Week from './all-day/Week.svelte';

    let {_viewDates, _intlDayHeader, _intlDayHeaderAL, allDaySlot, theme} = getContext('state');
</script>

<div class="{$theme.header}">
    <Section>
        {#each $_viewDates as date}
            <div class="{$theme.day} {$theme.weekdays?.[date.getUTCDay()]}" role="columnheader">
                <time
                    datetime="{toISOString(date, 10)}"
                    aria-label="{$_intlDayHeaderAL.format(date)}"
                    use:setContent={$_intlDayHeader.format(date)}
                ></time>
            </div>
        {/each}
    </Section>
    <div class="{$theme.hiddenScroll}"></div>
</div>
{#if $allDaySlot}
    <div class="{$theme.allDay}">
        <div class="{$theme.content}">
            <Section>
                <Week dates={$_viewDates}/>
            </Section>
            <div class="{$theme.hiddenScroll}"></div>
        </div>
    </div>
{/if}
<Body>
{#each $_viewDates as date}
    <Day {date}/>
{/each}
</Body>