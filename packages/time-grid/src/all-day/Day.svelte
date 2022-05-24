<script>
	import {getContext} from 'svelte';
	import {is_function} from 'svelte/internal';
	import {createDate,	setMidnight, toLocalDate, datesEqual, toViewWithLocalDates,	toISOString} from '@event-calendar/common';
	import Event from './Event.svelte';

	export let date;
	export let chunks;
	export let longChunks;
	export let iChunks = [];
	export let resource = undefined;

	let {date: currentDate, dateClick, highlightedDates, theme, _view, _interaction} = getContext('state');

	let el;
	let dayChunks;
	let today = setMidnight(createDate());
	let isToday;
	let highlight;

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
					view: toViewWithLocalDates($_view),
					resource
				});
			}
			: undefined;
	}
</script>

<div
	bind:this={el}
	class="{$theme.day}{isToday ? ' ' + $theme.today : ''}{highlight ? ' ' + $theme.highlight : ''}"
	on:click={createClickHandler($dateClick)}
>
	<!-- Drag & Resize -->
	{#if iChunks[0] && datesEqual(iChunks[0].date, date)}
		<div class="{$theme.events} {$theme.preview}">
			<Event chunk={iChunks[0]}/>
		</div>
	{/if}
	<div class="{$theme.events}">
		{#each dayChunks as chunk}
			<Event {chunk} {longChunks}/>
		{/each}
	</div>
</div>