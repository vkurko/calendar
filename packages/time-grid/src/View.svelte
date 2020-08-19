<script>
	import {getContext, setContext} from 'svelte';
	import State from './state';
	import Header from './Header.svelte';
	import Body from './Body.svelte';
	import Day from './Day.svelte';

	let {_viewDates, _intlDayHeader, theme} = getContext('state');

	let state = new State(getContext('state'));
	setContext('view-state', state);
</script>

<Header>
	{#each $_viewDates as date}
		<div class="{$theme.day}">{$_intlDayHeader.format(date)}</div>
	{/each}
</Header>
<Body>
	{#each $_viewDates as date}
		<Day {date}/>
	{/each}
</Body>