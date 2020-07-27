<script>
	import {getContext} from 'svelte';
	import {is_function} from 'svelte/internal';
	import {setMidnight, datesEqual} from '../../lib/date';
	import Event from './Event.svelte';

	export let date;
	export let chunks;
	export let longChunks;

	let {date: currentDate, dateClick, highlightDate, _view, theme} = getContext('state');

	let dayChunks;
	let today = setMidnight(new Date()), isToday, otherMonth, highlight;

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
		otherMonth = date.getMonth() !== $currentDate.getMonth();
		highlight = $highlightDate && datesEqual(date, $currentDate);
	}

	function handleClick(jsEvent) {
		if (is_function($dateClick)) {
			$dateClick({date, jsEvent, view: $_view});
		}
	}
</script>

<div class="{$theme.day}{isToday ? ' ' + $theme.today : ''}{otherMonth ? ' ' + $theme.otherMonth : ''}{highlight ? ' ' + $theme.highlight : ''}" on:click={handleClick}>
	<div class="{$theme.dayHead}">{date.getDate()}</div>
	<div class="{$theme.events}">
		{#each dayChunks as chunk}
			<Event {chunk} {longChunks}/>
		{/each}
	</div>
</div>