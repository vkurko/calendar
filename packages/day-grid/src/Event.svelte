<script>
	import {getContext, onMount, afterUpdate} from 'svelte';
	import {writable} from 'svelte/store';
	import {is_function} from 'svelte/internal';
	import {createEventContent} from '@event-calendar/common';

	export let chunk;
	export let longChunks;

	let {displayEventEnd, eventBackgroundColor, eventClick, eventColor, eventContent, eventDidMount,
		eventMouseEnter, eventMouseLeave, theme, _view, _intlEventTime} = getContext('state');

	let el;
	let style;
	let content;
	let timeText;
	let margin = writable(1);

	$: {
		// Class & Style
		let bgColor = chunk.event.backgroundColor || $eventBackgroundColor || $eventColor;
		style =
			`width:calc(${chunk.days * 100}% + ${(chunk.days - 1) * 7}px);` +
			`margin-top:${$margin}px;`
		;
		if (bgColor) {
			style += `background-color:${bgColor};`;
		}
	}

	$: {
		// Content
		[timeText, content] = createEventContent(chunk, $displayEventEnd, $eventContent, $theme, $_intlEventTime, $_view);
	}

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

	afterUpdate(reposition);

	function createHandler(fn) {
		return jsEvent => {
			if (is_function(fn)) {
				fn({event: chunk.event, el, jsEvent, view: $_view});
			}
		};
	}

	function reposition() {
		if (!el) {
			return;
		}
		let c = chunk;
		c.top = 0;
		if (c.prev) {
			c.top = c.prev.bottom + 1;
		}
		c.bottom = c.top + el.getBoundingClientRect().height;
		let key = c.date.getTime();
		if (longChunks[key]) {
			let m = 1;
			for (let longChunk of longChunks[key]) {
				if (c.top < longChunk.bottom && c.bottom > longChunk.top) {
					let offset = longChunk.bottom - c.top + 1;
					m += offset;
					c.top += offset;
					c.bottom += offset;
				}
			}
			$margin = m;
		}
	}
</script>

<div
	bind:this="{el}"
	class="{$theme.event}"
	{style}
	use:action={content}
	on:click={createHandler($eventClick)}
	on:mouseenter={createHandler($eventMouseEnter)}
	on:mouseleave={createHandler($eventMouseLeave)}
></div>

<svelte:window on:resize={reposition}/>