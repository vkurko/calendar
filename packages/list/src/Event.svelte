<script>
	import {getContext, onMount} from 'svelte';
	import {is_function} from 'svelte/internal';
	import {createEventContent, toEventWithLocalDates, toViewWithLocalDates} from '@event-calendar/common';
	import {setContent} from '@event-calendar/common';

	export let chunk;

	let {displayEventEnd, eventBackgroundColor, eventColor, eventContent, eventClick, eventDidMount,
		eventMouseEnter, eventMouseLeave, theme, _view, _intlEventTime} = getContext('state');

	let el;
	let style;
	let content;
	let timeText;

	$: {
		// Class & Style
		let bgColor = chunk.event.backgroundColor || $eventBackgroundColor || $eventColor;
		if (bgColor) {
			style = `background-color:${bgColor};`;
		}
	}

	$: {
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
	bind:this={el}
	class="{$theme.event}"
	on:click={createHandler($eventClick)}
	on:mouseenter={createHandler($eventMouseEnter)}
	on:mouseleave={createHandler($eventMouseLeave)}
>
	<div class="{$theme.eventTag}" {style}></div>
	<div use:setContent={content}></div>
</div>