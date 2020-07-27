<script>
	import {getContext, afterUpdate} from 'svelte';
	import {writable} from 'svelte/store';
	import {is_function} from 'svelte/internal';

	export let chunk;
	export let longChunks;

	let {eventContent, eventClick, eventBackgroundColor, eventColor, _view, _intlEventTime, theme} = getContext('state');

	let el;
	let style;
	let content;
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
		let timeText = `${$_intlEventTime.format(chunk.start)}`;
		if ($eventContent) {
			content = is_function($eventContent)
				? $eventContent({
					event: chunk.event,
					timeText
				})
				: $eventContent;
			if (typeof content === 'string') {
				content = {html: content};
			}
		} else {
			content = {
				html: `<div class="${$theme.eventContent}">` +
					`<div class="${$theme.eventTime}">${timeText}</div>` +
					`<div class="${$theme.eventTitle}">${chunk.event.title}</div>` +
					`</div>`
			};
		}
	}

	function action(node, content) {
		let actions = {
			update(content) {
				while (node.firstChild) {
					node.removeChild(node.lastChild);
				}
				if (content.domNodes) {
					node.append(...content.domNodes);
				} else if (content.html) {
					node.innerHTML = content.html;
				}
			}
		};
		actions.update(content);
		return actions;
	}

	afterUpdate(reposition);

	function handleClick(jsEvent) {
		if (is_function($eventClick)) {
			$eventClick({event: chunk.event, el, jsEvent, view: $_view});
		}
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

<div bind:this="{el}" class="{$theme.event}" {style} use:action={content} on:click={handleClick}></div>

<svelte:window on:resize={reposition}/>