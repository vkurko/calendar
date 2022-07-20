<script>
	import {getContext} from 'svelte';
	import {cloneDate, addDay, datesEqual} from '@event-calendar/common';
	import {createEventChunk} from '@event-calendar/common';
	import {prepareEventChunks} from './events';
	import Day from './Day.svelte';

	export let dates;

	let {_events, _iEvents, hiddenDays, theme} = getContext('state');

	let chunks, longChunks, iChunks = [];

	let start;
	let end;

	$: {
		start = dates[0];
		end = addDay(cloneDate(dates[dates.length - 1]));
	}

	$: {
		chunks = [];
		for (let event of $_events) {
			if (event.display !== 'background' && intersects(event)) {
				let chunk = createEventChunk(event, start, end);
				chunks.push(chunk);
			}
		}
		longChunks = prepareEventChunks(chunks, $hiddenDays);
	}

	$: iChunks = $_iEvents.map(event => {
		let chunk;
		if (event && intersects(event)) {
			chunk = createEventChunk(event, start, end);
			prepareEventChunks([chunk], $hiddenDays);
		} else {
			chunk = null;
		}
		return chunk;
	});

	function intersects(event) {
		return event.start < end && event.end > start || datesEqual(event.start, event.end, start);
	}
</script>

<div class="{$theme.days}">
	{#each dates as date}
		<Day {date} {chunks} {longChunks} {iChunks} />
	{/each}
</div>