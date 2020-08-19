<script>
	import {getContext, setContext} from 'svelte';
	import State from './state';
	import Header from './Header.svelte';
	import Body from './Body.svelte';
	import Week from './Week.svelte';

	let {_viewDates, theme} = getContext('state');

	let state = new State(getContext('state'));
	setContext('view-state', state);

	let weeks;

	$: {
		weeks = [];
		for (let i = 0; i < $_viewDates.length / 7; ++i) {
			let dates = [];
			for (let j = 0; j < 7; ++j) {
				dates.push($_viewDates[i * 7 + j]);
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