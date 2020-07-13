<script>
	import {getContext} from 'svelte';
	import {is_function} from 'svelte/internal';
	import {cloneDate, addDay, addDuration, setHours} from '../../lib/date';
	import {createEventChunk, groupEventChunks} from '../../lib/events';
	import Event from './Event.svelte';

	export let date;
	export let resource = undefined;

	let {_events, date: currentDate, dateClick, slotDuration, highlightDate, _view, theme} = getContext('state');

	let chunks, bgChunks;
	let today = setHours(new Date(), 0, 0, 0, 0), isToday, highlight;

	$: {
		chunks = [];
		bgChunks = [];
		let start = cloneDate(date);
		let end = addDay(cloneDate(date));
		for (let event of $_events) {
			if (event.start < end && event.end > start && (resource === undefined || event.resourceIds.includes(String(resource.id)))) {
				let object = createEventChunk(event, start, end);
				switch (event.display) {
					case 'background': bgChunks.push(object); break;
					default: chunks.push(object);
				}
			}
		}
		groupEventChunks(chunks);
	}

	$: {
		isToday = date.getTime() === today.getTime();
		highlight = $highlightDate && date.getTime() === $currentDate.getTime();
	}

	function handleClick(jsEvent) {
		if (is_function($dateClick)) {
			let rect = jsEvent.currentTarget.getBoundingClientRect();
			let y = jsEvent.clientY - rect.top;
			let d = addDuration(cloneDate(date), $slotDuration, Math.floor(y/24));
			$dateClick({date: d, jsEvent, view: $_view, resource});
		}
	}
</script>

<div class="{$theme.column}{isToday ? ' ' + $theme.today : ''}{highlight ? ' ' + $theme.highlight : ''}" on:click={handleClick}>
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