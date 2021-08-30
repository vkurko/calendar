<script>
	import {getContext} from 'svelte';
	import {is_function} from 'svelte/internal';
	import {
		createDate,
		setMidnight,
		toLocalDate,
		datesEqual,
		toViewWithLocalDates,
		toISOString
	} from '@event-calendar/common';
	import Event from './Event.svelte';

	export let date;
	export let chunks;
	export let longChunks;
	export let dragChunk = null;

	let {date: currentDate, dateClick, highlightedDates, _view, theme} = getContext('state');

	let el;
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

	function createClickHandler(fn) {
		return is_function(fn)
			? jsEvent => {
				fn({
					date: toLocalDate(date),
					dateStr: toISOString(date),
					dayEl: el,
					jsEvent,
					view: toViewWithLocalDates($_view)
				});
			}
			: undefined;
	}
</script>

<div
	bind:this={el}
	class="{$theme.day}{isToday ? ' ' + $theme.today : ''}{otherMonth ? ' ' + $theme.otherMonth : ''}{highlight ? ' ' + $theme.highlight : ''}"
	on:click={createClickHandler($dateClick)}
>
	<div class="{$theme.dayHead}">{date.getUTCDate()}</div>
	{#if dragChunk && datesEqual(dragChunk.date, date)}
		<div class="{$theme.events} {$theme.preview}">
			<Event chunk={dragChunk}/>
		</div>
	{/if}
	<div class="{$theme.events}">
		{#each dayChunks as chunk}
			<Event {chunk} {longChunks}/>
		{/each}
	</div>
</div>