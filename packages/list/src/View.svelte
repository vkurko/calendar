<script>
	import {getContext, setContext} from 'svelte';
	import {is_function} from 'svelte/internal';
	import Body from './Body.svelte';
	import Day from './Day.svelte';
	import State from './state';
	import {addDay, cloneDate, toViewWithLocalDates, setContent} from '@event-calendar/common';

	let {_events, _view, _viewDates, noEventsClick, noEventsContent, theme} = getContext('state');

	let state = new State(getContext('state'));
	setContext('view-state', state);

	let noEvents, content;

	$: {
		noEvents = true;
		let start = $_viewDates[0];
		let end = addDay(cloneDate($_viewDates[$_viewDates.length - 1]));
		for (let event of $_events) {
			if (event.display === 'auto' && event.start < end && event.end > start) {
				noEvents = false;
				break;
			}
		}
	}

	$: {
		content = is_function($noEventsContent) ? $noEventsContent() : $noEventsContent;
		if (typeof content === 'string') {
			content = {html: content};
		}
	}

	function handleClick(jsEvent) {
		if (is_function($noEventsClick)) {
			$noEventsClick({jsEvent, view: toViewWithLocalDates($_view)});
		}
	}
</script>

<Body>
	{#if noEvents}
		<div use:setContent={content} class="{$theme.noEvents}" on:click={handleClick}></div>
	{:else}
		{#each $_viewDates as date}
			<Day {date}/>
		{/each}
	{/if}
</Body>