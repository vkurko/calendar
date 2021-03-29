<script>
	import {getContext, onMount} from 'svelte';
	import {is_function} from 'svelte/internal';
	import {createEventContent, toEventWithLocalDates, toViewWithLocalDates, setContent} from '@event-calendar/common';

	export let date;
	export let chunk;

	let {displayEventEnd, eventBackgroundColor, eventColor, eventContent, eventClick, eventDidMount,
		eventMouseEnter, eventMouseLeave, slotDuration, theme, _view, _intlEventTime, _interaction} = getContext('state');

	let {_slotTimeLimits, _viewResources} = getContext('view-state');

	let el;
	let display;
	let classes;
	let style;
	let content;
	let timeText;
	let dragged = false;

	$: {
		display = chunk.event.display;

		// Style
		let step = $slotDuration.seconds / 60;
		let offset = $_slotTimeLimits.min.seconds / 60;
		let start = (chunk.start - date) / 1000 / 60;
		let end = (chunk.end - date) / 1000 / 60;
		let top = (start - offset) / step * 24;
		let height = (end - start) / step * 24;
		let maxHeight = ($_slotTimeLimits.max.seconds / 60 - start) / step * 24;
		let bgColor = chunk.event.backgroundColor || $eventBackgroundColor || $eventColor;
		style =
			`top:${top}px;` +
			`min-height:${height}px;` +
			`height:${height}px;` +
			`max-height:${maxHeight}px;`
		;
		if (bgColor) {
			style += `background-color:${bgColor};`;
		}
		if (display === 'auto' || display === 'ghost') {
			style +=
				`z-index:${chunk.column + 1};` +
				`left:${100 / chunk.group.columns.length * chunk.column}%;` +
				`width:${100 / chunk.group.columns.length * 0.5 * (1 + chunk.group.columns.length - chunk.column)}%;`
			;
		}

		// Class
		let className = display === 'background' ? $theme.bgEvent : $theme.event;
		classes = $_interaction.drag ? $_interaction.drag.classes(display, className) : className;
	}

	// Content
	$: [timeText, content] = createEventContent(chunk, $displayEventEnd, $eventContent, $theme, $_intlEventTime, $_view);

	onMount(() => {
		if (is_function($eventDidMount)) {
			$eventDidMount({
				event: toEventWithLocalDates(chunk.event),
				timeText,
				el,
				view: toViewWithLocalDates($_view)
			});
		}
	});

	function createHandler(fn, display) {
		return display !== 'preview' && is_function(fn)
			? jsEvent => fn({event: toEventWithLocalDates(chunk.event), el, jsEvent, view: toViewWithLocalDates($_view)})
			: undefined;
	}

	function createMouseDownHandler(interaction, display) {
		return display === 'auto' &&  interaction.drag
			? jsEvent => interaction.drag.startTimeGrid(chunk.event, el, jsEvent, _viewResources)
			: undefined;
	}
</script>

<div
	bind:this={el}
	class="{classes}"
	{style}
	use:setContent={content}
	on:click={createHandler($eventClick, display)}
	on:mouseenter={createHandler($eventMouseEnter, display)}
	on:mouseleave={createHandler($eventMouseLeave, display)}
	on:mousedown={createMouseDownHandler($_interaction, display)}
></div>