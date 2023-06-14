<script>
    import {getContext} from 'svelte';
    import Header from './Header.svelte';
    import Body from './Body.svelte';
    import Week from './Week.svelte';

    let {_viewDates, _viewClass, _hiddenEvents, dayMaxEvents, hiddenDays, theme} = getContext('state');

    $_viewClass = 'month';

    let weeks;
    let days;

    $: {
        weeks = [];
        days = 7 - $hiddenDays.length;
        $_hiddenEvents = {};
        $dayMaxEvents;
        for (let i = 0; i < $_viewDates.length / days; ++i) {
            let dates = [];
            for (let j = 0; j < days; ++j) {
                dates.push($_viewDates[i * days + j]);
            }
            weeks.push(dates);
        }
    }
</script>

<Header/>
<Body>
{#each weeks as dates}
    <Week {dates}/>
{/each}
</Body>