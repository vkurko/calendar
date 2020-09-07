<script>
	import {getContext, onMount} from 'svelte';
	import {is_function} from 'svelte/internal';
	import {createEventContent} from '@event-calendar/common';
	import {action} from '@event-calendar/common';

	export let chunk;

	let {displayEventEnd, eventBackgroundColor, eventColor, eventContent, eventClick, eventDidMount,
		eventMouseEnter, eventMouseLeave, theme, _view, _intlEventTime} = getContext('state');

	let el;
	let content;
	let timeText;

	$: {
		// Content
		let bgColor = chunk.event.backgroundColor || $eventBackgroundColor || $eventColor;
		[timeText, content] = createEventContent(chunk, $displayEventEnd, $eventContent, $theme, $_intlEventTime, $_view, true, bgColor);
	}

	onMount(() => {
		if (is_function($eventDidMount)) {
			$eventDidMount({
				event: chunk.event,
				timeText,
				el,
				view: $_view
			});
		}
	});

	function createHandler(fn) {
		return jsEvent => {
			if (is_function(fn)) {
				fn({event: chunk.event, el, jsEvent, view: $_view});
			}
		};
	}
</script>

<div
	bind:this="{el}"
	class="{$theme.event}"
	use:action={content}
	on:click={createHandler($eventClick)}
	on:mouseenter={createHandler($eventMouseEnter)}
	on:mouseleave={createHandler($eventMouseLeave)}
></div>