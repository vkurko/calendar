<script>
	import {getContext} from 'svelte';
	import {is_function} from 'svelte/internal';
	import {createDate, cloneDate, addDuration, setMidnight, datesEqual} from '@event-calendar/common';
	import {createEventChunk} from '@event-calendar/common';
	import {groupEventChunks} from './events';
	import Event from './Event.svelte';

	export let date;
	export let resource = undefined;

	let {_events, dateClick, highlightedDates, slotDuration, _view, theme} = getContext('state');
	let {_slotTimeLimits} = getContext('view-state');

	let chunks, bgChunks;
	let today = setMidnight(createDate()), isToday, highlight;

	$: {
		chunks = [];
		bgChunks = [];
		let start = addDuration(cloneDate(date), $_slotTimeLimits.min);
		let end = addDuration(cloneDate(date), $_slotTimeLimits.max);
		for (let event of $_events) {
			if (event.start < end && event.end > start && (resource === undefined || event.resourceIds.includes(resource.id))) {
				let chunk = createEventChunk(event, start, end);
				switch (event.display) {
					case 'background': bgChunks.push(chunk); break;
					default: chunks.push(chunk);
				}
			}
		}
		groupEventChunks(chunks);
	}

	$: {
		isToday = datesEqual(date, today);
		highlight = $highlightedDates.some(d => datesEqual(d, date));
	}

	function handleClick(jsEvent) {
		if (is_function($dateClick)) {
			let rect = jsEvent.currentTarget.getBoundingClientRect();
			let y = jsEvent.clientY - rect.top;
			let d = addDuration(cloneDate(date), $slotDuration, Math.floor(y/24 + $_slotTimeLimits.min.seconds/$slotDuration.seconds));
			$dateClick({date: d, jsEvent, view: $_view, resource});
		}
	}
</script>

<div class="{$theme.day}{isToday ? ' ' + $theme.today : ''}{highlight ? ' ' + $theme.highlight : ''}" on:click={handleClick}>
	<div class="{$theme.bgEvents}">
		{#each bgChunks as chunk}
			<Event {date} {chunk}/>
		{/each}
	</div>
	<div class="{$theme.events}">
		{#each chunks as chunk}
			<Event {date} {chunk}/>
		{/each}
	</div>
</div>