<script>
	import {getContext} from 'svelte';
	import {cloneDate, addDay} from '@event-calendar/common';
	import {createEventChunk} from '@event-calendar/common';
	import {prepareEventChunks} from './events';
	import Day from './Day.svelte';

	export let dates;

	let {_events, _dragEvent, hiddenDays, theme} = getContext('state');

	let chunks;
	let longChunks;
	let dragChunk;

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

	// Drag & drop
	$: if ($_dragEvent && intersects($_dragEvent)) {
		dragChunk = createEventChunk($_dragEvent, start, end);
		prepareEventChunks([dragChunk], $hiddenDays);
	} else {
		dragChunk = null;
	}

	function intersects(event) {
		return event.start < end && event.end > start;
	}
</script>

<div class="{$theme.days}">
	{#each dates as date}
		<Day {date} {chunks} {longChunks} {dragChunk}/>
	{/each}
</div>