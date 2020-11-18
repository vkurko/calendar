<script>
	import {getContext} from 'svelte';
	import {is_function} from 'svelte/internal';
	import {
		addDay,
		cloneDate,
		createDate,
		createEventChunk,
		datesEqual,
		setMidnight,
		toLocalDate,
		sortEventChunks
	} from '@event-calendar/common';
	import Event from './Event.svelte';

	export let date;

	let {_events, _intlDayHeader, _view, date: currentDate, dateClick, highlightedDates, theme} = getContext('state');
	let {_intlListDayFormat, _intlListDaySideFormat} = getContext('view-state');

	let chunks;
	let today = setMidnight(createDate()), isToday, highlight;

	$: {
		chunks = [];
		let start = date;
		let end = addDay(cloneDate(date));
		for (let event of $_events) {
			if (event.display === 'auto' && event.start < end && event.end > start) {
				let chunk = createEventChunk(event, start, end);
				chunks.push(chunk);
			}
		}
		sortEventChunks(chunks);
	}

	$: {
		isToday = datesEqual(date, today);
		highlight = $highlightedDates.some(d => datesEqual(d, date));
	}

	function handleClick(jsEvent) {
		if (is_function($dateClick)) {
			$dateClick({date: toLocalDate(date), jsEvent, view: $_view});
		}
	}
</script>

{#if chunks.length}
	<div class="{$theme.day}{isToday ? ' ' + $theme.today : ''}{highlight ? ' ' + $theme.highlight : ''}" on:click={handleClick}>
		{$_intlListDayFormat.format(date)}
		<span class="{$theme.daySide}">{$_intlListDaySideFormat.format(date)}</span>
	</div>
	{#each chunks as chunk}
		<Event {chunk}/>
	{/each}
{/if}