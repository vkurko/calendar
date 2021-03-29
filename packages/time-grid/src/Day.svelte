<script>
	import {getContext} from 'svelte';
	import {is_function} from 'svelte/internal';
	import {
		createDate,
		cloneDate,
		addDuration,
		setMidnight,
		toLocalDate,
		datesEqual,
		createEventChunk,
		toViewWithLocalDates,
		rect
	} from '@event-calendar/common';
	import {groupEventChunks} from './events';
	import Event from './Event.svelte';

	export let date;
	export let resource = undefined;

	let {_events, _dragEvent, dateClick, highlightedDates, slotDuration, _view, theme} = getContext('state');
	let {_slotTimeLimits} = getContext('view-state');

	let chunks, bgChunks, dragChunk;
	let today = setMidnight(createDate()), isToday, highlight;

	let start, end;

	$: {
		start = addDuration(cloneDate(date), $_slotTimeLimits.min);
		end = addDuration(cloneDate(date), $_slotTimeLimits.max);
	}

	$: {
		chunks = [];
		bgChunks = [];
		for (let event of $_events) {
			if (intersects(event)) {
				let chunk = createEventChunk(event, start, end);
				switch (event.display) {
					case 'background': bgChunks.push(chunk); break;
					default: chunks.push(chunk);
				}
			}
		}
		groupEventChunks(chunks);
	}

	// Drag & drop
	$: if ($_dragEvent && intersects($_dragEvent)) {
		dragChunk = createEventChunk($_dragEvent, start, end);
	} else {
		dragChunk = null;
	}

	$: {
		isToday = datesEqual(date, today);
		highlight = $highlightedDates.some(d => datesEqual(d, date));
	}

	function createClickHandler(fn) {
		return is_function(fn)
			? jsEvent =>  {
				let r = rect(jsEvent.currentTarget);
				let y = jsEvent.clientY - r.top;
				let d = addDuration(cloneDate(date), $slotDuration, Math.floor(y/24 + $_slotTimeLimits.min.seconds/$slotDuration.seconds));
				fn({date: toLocalDate(d), jsEvent, view: toViewWithLocalDates($_view), resource});
			}
			: undefined;
	}

	function intersects(event) {
		return event.start < end && event.end > start && (resource === undefined || event.resourceIds.includes(resource.id));
	}
</script>

<div
	class="{$theme.day}{isToday ? ' ' + $theme.today : ''}{highlight ? ' ' + $theme.highlight : ''}"
	on:click={createClickHandler($dateClick)}
>
	<div class="{$theme.bgEvents}">
		{#each bgChunks as chunk}
			<Event {date} {chunk}/>
		{/each}
	</div>
	<div class="{$theme.events}">
		{#each chunks as chunk}
			<Event {date} {chunk}/>
		{/each}
		{#if dragChunk}
			<Event {date} chunk={dragChunk}/>
		{/if}
	</div>
</div>