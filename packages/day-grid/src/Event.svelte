<script>
	import {getContext, onMount, afterUpdate, tick} from 'svelte';
	import {writable} from 'svelte/store';
	import {is_function} from 'svelte/internal';
	import {createEventContent, toEventWithLocalDates, toViewWithLocalDates, setContent} from '@event-calendar/common';

	export let chunk;
	export let longChunks = {};

	let {displayEventEnd, eventBackgroundColor, eventClick, eventColor, eventContent, eventDidMount,
		eventMouseEnter, eventMouseLeave, theme, _view, _intlEventTime, _interaction} = getContext('state');

	let el;
	let classes;
	let style;
	let content;
	let timeText;
	let margin = writable(1);
	let display;

	$: {
		display = chunk.event.display;

		// Class & Style
		let bgColor = chunk.event.backgroundColor || $eventBackgroundColor || $eventColor;
		style =
			`width:calc(${chunk.days * 100}% + ${(chunk.days - 1) * 7}px);` +
			`margin-top:${$margin}px;`
		;
		if (bgColor) {
			style += `background-color:${bgColor};`;
		}

		classes = $_interaction.drag ? $_interaction.drag.classes(display, $theme.event) : $theme.event;
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

	afterUpdate(reposition);

	function createHandler(fn, display) {
		return display !== 'preview' && is_function(fn)
			? jsEvent => fn({event: toEventWithLocalDates(chunk.event), el, jsEvent, view: toViewWithLocalDates($_view)})
			: undefined;
	}

	function createDragStartHandler(interaction, display) {
		return display === 'auto' && interaction.drag
			? jsEvent => interaction.drag.startDayGrid(chunk.event, el, jsEvent)
			: undefined;
	}

	function reposition() {
		if (!el || display === 'preview') {
			return;
		}
		let c = chunk;
		c.top = 0;
		if (c.prev) {
			if (c.prev.bottom === undefined) {
				// 'prev' is not ready yet, try again later
				tick().then(reposition);
				return;
			}
			c.top = c.prev.bottom + 1;
		}
		c.bottom = c.top + el.offsetHeight;
		let m = 1;
		let key = c.date.getTime();
		if (longChunks[key]) {
			for (let longChunk of longChunks[key]) {
				if (longChunk.bottom === undefined) {
					// 'longChunk' is not ready yet, try again later
					tick().then(reposition);
					return;
				}
				if (c.top < longChunk.bottom && c.bottom > longChunk.top) {
					let offset = longChunk.bottom - c.top + 1;
					m += offset;
					c.top += offset;
					c.bottom += offset;
				}
			}
		}
		$margin = m;
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
	on:pointerdown={createDragStartHandler($_interaction, display)}
></div>

<svelte:window on:resize={reposition}/>