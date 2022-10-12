<script>
    import {getContext, setContext} from 'svelte';
    import State from './state';
    import Header from './Header.svelte';
    import Body from './Body.svelte';
    import Day from './Day.svelte';
    import Week from './all-day/Week.svelte';

    let state = getContext('state');
    let {_viewDates, _intlDayHeader, _viewClass, allDaySlot, theme} = state;

    setContext('view-state', new State(state));

    $_viewClass = 'week';
</script>

<Header>
    {#each $_viewDates as date}
        <div class="{$theme.day}">{$_intlDayHeader.format(date)}</div>
    {/each}
</Header>
{#if $allDaySlot}
    <Header allDay>
        <Week dates={$_viewDates}/>
    </Header>
{/if}
<Body>
{#each $_viewDates as date}
    <Day {date}/>
{/each}
</Body>