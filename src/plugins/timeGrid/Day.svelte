<script>
	import {getContext} from 'svelte';
	import {is_function} from 'svelte/internal';
	import {cloneDate, addDay, addDuration, setMidnight, datesEqual} from '../../lib/date';
	import {createEventChunk} from '../../lib/events';
	import {groupEventChunks} from './events';
	import Event from './Event.svelte';

	export let date;
	export let resource = undefined;

	let {_events, date: currentDate, dateClick, slotDuration, highlightDate, _view, theme} = getContext('state');
	let {_slotTimeLimits} = getContext('view-state');

	let chunks, bgChunks;
	let today = setMidnight(new Date()), isToday, highlight;

	$: {
		chunks = [];
		bgChunks = [];
		let start = date;
		let end = addDay(cloneDate(date));
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
		highlight = $highlightDate && datesEqual(date, $currentDate);
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
			<Event {chunk}/>
		{/each}
	</div>
	<div class="{$theme.events}">
		{#each chunks as chunk}
			<Event {chunk}/>
		{/each}
	</div>
</div>