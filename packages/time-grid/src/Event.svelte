<script>
	import {getContext, onMount} from 'svelte';
	import {is_function} from 'svelte/internal';
	import {createEventContent} from '@event-calendar/common';

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
		let top = 24 * ((start - offset) / step);
		let height = 24 * ((end - start) / step);
		let bgColor = chunk.event.backgroundColor || $eventBackgroundColor || $eventColor;
		style =
			`top:${top}px;` +
			`min-height:${height}px;` +
			`max-height:${height}px;` +
			`z-index:${chunk.column + 1};`
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
				event: chunk.event,
				timeText,
				el,
				view: $_view
			});
		}
	});

	function action(node, content) {
		let actions = {
			update(content) {
				while (node.firstChild) {
					node.removeChild(node.lastChild);
				}
				if (content.domNodes) {
					for (let child of content.domNodes) {
						node.appendChild(child);
					}
				} else if (content.html) {
					node.innerHTML = content.html;
				}
			}
		};
		actions.update(content);
		return actions;
	}

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
	class="{className}"
	{style}
	use:action={content}
	on:click={createHandler($eventClick)}
	on:mouseenter={createHandler($eventMouseEnter)}
	on:mouseleave={createHandler($eventMouseLeave)}
></div>