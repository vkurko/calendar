<script>
	import {getContext, onMount} from 'svelte';
	import {is_function} from 'svelte/internal';

	export let chunk;

	let {eventContent, eventClick, eventDidMount, eventBackgroundColor, eventColor, slotDuration, _view, _intlEventTime, theme} = getContext('state');
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
		let start = chunk.start.getHours() * 60 + chunk.start.getMinutes();
		let end = chunk.end.getDate() !== chunk.start.getDate() ? 24 * 60 : (chunk.end.getHours() * 60 + chunk.end.getMinutes());
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
		timeText = `${$_intlEventTime.format(chunk.start)} - ${$_intlEventTime.format(chunk.end)}`;
		if ($eventContent) {
			content = is_function($eventContent)
				? $eventContent({
					event: chunk.event,
					timeText,
					view: $_view
				})
				: $eventContent;
			if (typeof content === 'string') {
				content = {html: content};
			}
		} else {
			switch (chunk.event.display) {
				case 'background':
					content = {html: ''};
					break;
				default:
					content = {
						html: `<div class="${$theme.eventContent}">` +
							`<div class="${$theme.eventTime}">${timeText}</div>` +
							`<div class="${$theme.eventTitle}">${chunk.event.title}</div>` +
							`</div>`
					};
			}
		}
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

	function handleClick(jsEvent) {
		if (is_function($eventClick)) {
			$eventClick({event: chunk.event, el, jsEvent, view: $_view});
		}
	}
</script>

<div bind:this="{el}" class="{className}" {style} use:action={content} on:click={handleClick}></div>