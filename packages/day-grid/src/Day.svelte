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
	export let interactionChunks = [];

	let {date: currentDate, dateClick, highlightedDates, _view, theme, _interaction} = getContext('state');

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

	function createPointerEnterHandler(interaction) {
		return interaction.pointer
			? jsEvent => interaction.pointer.enterDayGrid(date, jsEvent)
			: undefined;
	}

	function createPointerLeaveHandler(interaction) {
		return interaction.pointer ? interaction.pointer.leave : undefined;
	}
</script>

<div
	bind:this={el}
	class="{$theme.day}{isToday ? ' ' + $theme.today : ''}{otherMonth ? ' ' + $theme.otherMonth : ''}{highlight ? ' ' + $theme.highlight : ''}"
	on:click={createClickHandler($dateClick)}
	on:pointerenter={createPointerEnterHandler($_interaction)}
	on:pointerleave={createPointerLeaveHandler($_interaction)}
>
	<div class="{$theme.dayHead}">{date.getUTCDate()}</div>
	{#if interactionChunks[1] && datesEqual(interactionChunks[1].date, date)}
		<div class="{$theme.events}">
			<Event chunk={interactionChunks[1]}/>
		</div>
	{/if}
	{#if interactionChunks[0] && datesEqual(interactionChunks[0].date, date)}
		<div class="{$theme.events} {$theme.preview}">
			<Event chunk={interactionChunks[0]}/>
		</div>
	{/if}
	<div class="{$theme.events}">
		{#each dayChunks as chunk}
			<Event {chunk} {longChunks}/>
		{/each}
	</div>
</div>