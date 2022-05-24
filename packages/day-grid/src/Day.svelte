<script>
	import {getContext} from 'svelte';
	import {is_function} from 'svelte/internal';
	import {createDate,	setMidnight, toLocalDate, datesEqual, setContent, toViewWithLocalDates,	toISOString,
		createEventChunk, addDay, cloneDate, assign} from '@event-calendar/common';
	import Event from './Event.svelte';
	import Popup from './Popup.svelte';

	export let date;
	export let chunks;
	export let longChunks;
	export let iChunks = [];

	let {date: currentDate, dateClick, dayMaxEvents, highlightedDates, moreLinkContent, theme,
		_view, _interaction} = getContext('state');
	let {_hiddenEvents, _popup} = getContext('view-state');

	let el;
	let dayChunks;
	let today = setMidnight(createDate());
	let isToday;
	let otherMonth;
	let highlight;
	let hiddenEvents = new Set();  // hidden events of this day
	let moreLink = '';

	$: $_hiddenEvents[date.getTime()] = hiddenEvents;

	$: {
		dayChunks = [];
		hiddenEvents.clear();
		hiddenEvents = hiddenEvents;
		for (let chunk of chunks) {
			if (datesEqual(chunk.date, date)) {
				dayChunks.push(chunk);
				// if ($dayMaxEvents !== false && dayChunks.length > $dayMaxEvents) {
				// 	chunk.hidden = true;
				// }
			}
		}
	}

	$: {
		isToday = datesEqual(date, today);
		otherMonth = date.getUTCMonth() !== $currentDate.getUTCMonth();
		highlight = $highlightedDates.some(d => datesEqual(d, date));
	}

	$: if ($_hiddenEvents && hiddenEvents.size) {  // make Svelte update this block on $_hiddenEvents update
		let text = '+' + hiddenEvents.size + ' more';
		if ($moreLinkContent) {
			moreLink = is_function($moreLinkContent) ? $moreLinkContent({num: hiddenEvents.size, text}) : $moreLinkContent;
			if (typeof moreLink === 'string') {
				moreLink = {html: moreLink};
			}
		} else {
			moreLink = {html: text};
		}
	}

	$: if ($_popup.date && datesEqual(date, $_popup.date) && longChunks && dayChunks) {
		setPopupChunks();
	}

	function createClickHandler(fn) {
		return is_function(fn)
			? jsEvent => {
				!jsEvent.ecClosingPopup && fn({
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

	function showMore() {
		setPopupChunks();
		$_popup.date = date;
	}

	function setPopupChunks() {
		let nextDay = addDay(cloneDate(date));
		$_popup.chunks = dayChunks.concat((longChunks[date.getTime()] || []))
			.map(c => assign({}, c, createEventChunk(c.event, date, nextDay), {days: 1, dates: [date]}))
			.sort((a, b) => a.top - b.top);
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
	<!-- Pointer -->
	{#if iChunks[1] && datesEqual(iChunks[1].date, date)}
		<div class="{$theme.events}">
			<Event chunk={iChunks[1]}/>
		</div>
	{/if}
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
	{#if $_popup.date && datesEqual(date, $_popup.date)}
		<Popup/>
	{/if}
	<div class="{$theme.dayFoot}">
		{#if hiddenEvents.size}
			<a on:click|stopPropagation={showMore} use:setContent={moreLink}></a>
		{/if}
	</div>
</div>