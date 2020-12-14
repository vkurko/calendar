<script>
	import {getContext} from 'svelte';
	import {is_function} from 'svelte/internal';
	import {createDate, setMidnight, toLocalDate, datesEqual, toViewWithLocalDates} from '@event-calendar/common';
	import Event from './Event.svelte';

	export let date;
	export let chunks;
	export let longChunks;

	let {date: currentDate, dateClick, highlightedDates, _view, theme} = getContext('state');

	let dayChunks;
	let today = setMidnight(createDate()), isToday, otherMonth, highlight;

	$: {
		dayChunks = [];
		for (let chunk of chunks) {
			if (datesEqual(chunk.date, date)) {
				dayChunks.push(chunk);
			}
		}
	}

	$: {
		isToday = datesEqual(date, today);
		otherMonth = date.getUTCMonth() !== $currentDate.getUTCMonth();
		highlight = $highlightedDates.some(d => datesEqual(d, date));
	}

	function handleClick(jsEvent) {
		if (is_function($dateClick)) {
			$dateClick({date: toLocalDate(date), jsEvent, view: toViewWithLocalDates($_view)});
		}
	}
</script>

<div class="{$theme.day}{isToday ? ' ' + $theme.today : ''}{otherMonth ? ' ' + $theme.otherMonth : ''}{highlight ? ' ' + $theme.highlight : ''}" on:click={handleClick}>
	<div class="{$theme.dayHead}">{date.getUTCDate()}</div>
	<div class="{$theme.events}">
		{#each dayChunks as chunk}
			<Event {chunk} {longChunks}/>
		{/each}
	</div>
</div>