<script>
	import {getContext, onMount} from 'svelte';
	import {is_function} from 'svelte/internal';
	import {action, createEventContent, toEventWithLocalDates, toViewWithLocalDates} from '@event-calendar/common';

	export let date;
	export let chunk;

	let {displayEventEnd, eventBackgroundColor, eventColor, eventContent, eventClick, eventDidMount,
		eventMouseEnter, eventMouseLeave, slotDuration, theme, _view, _intlEventTime} = getContext('state');

	let {_slotTimeLimits} = getContext('view-state');

	let el;
	let className;
	let style;
	let content;
	let timeText;

	$: {
		// Class & Style
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
		switch (chunk.event.display) {
			case 'background':
				className = $theme.bgEvent;
				break;
			default:
				className = $theme.event;
				style +=
					`z-index:${chunk.column + 1};` +
					`left:${100 / chunk.group.columns.length * chunk.column}%;` +
					`width:${100 / chunk.group.columns.length * 0.5 * (1 + chunk.group.columns.length - chunk.column)}%;`
				;
		}

		// Content
		[timeText, content] = createEventContent(chunk, $displayEventEnd, $eventContent, $theme, $_intlEventTime, $_view);
	}

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

	function createHandler(fn) {
		return jsEvent => {
			if (is_function(fn)) {
				fn({event: toEventWithLocalDates(chunk.event), el, jsEvent, view: toViewWithLocalDates($_view)});
			}
		};
	}
</script>

<div
	bind:this="{el}"
	class="{className}"
	{style}
	use:action={content}
	on:click={createHandler($eventClick)}
	on:mouseenter={createHandler($eventMouseEnter)}
	on:mouseleave={createHandler($eventMouseLeave)}
></div>