<script>
	import {getContext} from 'svelte';
	import {cloneDate, addDay} from '@event-calendar/common';
	import {createEventChunk} from '@event-calendar/common';
	import {prepareEventChunks} from './events';
	import Day from './Day.svelte';

	export let dates;

	let {_events, hiddenDays, theme} = getContext('state');

	let chunks;
	let longChunks;

	$: {
		chunks = [];
		let start = dates[0];
		let end = addDay(cloneDate(dates[dates.length - 1]));
		for (let event of $_events) {
			if (event.display === 'auto' && event.start < end && event.end > start) {
				let chunk = createEventChunk(event, start, end);
				chunks.push(chunk);
			}
		}
		longChunks = prepareEventChunks(chunks, $hiddenDays);
	}
</script>

<div class="{$theme.days}">
	{#each dates as date}
		<Day {date} {chunks} {longChunks}/>
	{/each}
</div>