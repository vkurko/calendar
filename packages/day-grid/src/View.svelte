<script>
	import {getContext, setContext} from 'svelte';
	import State from './state';
	import Header from './Header.svelte';
	import Body from './Body.svelte';
	import Week from './Week.svelte';

	let {_viewDates, hiddenDays, theme} = getContext('state');

	let state = new State(getContext('state'));
	setContext('view-state', state);

	let {_hiddenEvents} = state;

	let weeks;
	let days;

	$: {
		weeks = [];
		days = 7 - $hiddenDays.length;
		$_hiddenEvents = {};
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