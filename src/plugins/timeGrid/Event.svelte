<script>
	import {getContext} from 'svelte';

	export let event;

	let {eventContent, eventClick, slotDuration, timeFormat, theme} = getContext('options');

	let el;
	let className;
	let style;
	let content;

	$: {
		// Class & Style
		let step = $slotDuration.seconds / 60;
		let start = event.start.getHours() * 60 + event.start.getMinutes();
		let end = event.end.getDate() > event.start.getDate() ? 24 * 60 : (event.end.getHours() * 60 + event.end.getMinutes())
		style = `
			top: ${40 * (start / step)}px;
			height: ${40 * ((end - start) / step)}px;
			z-index: ${event.column + 1};
		`;
		switch (event.display) {
			case 'background':
				className = $theme.bgEvent;
				break;
			default:
				className = $theme.event;
				style += `
					left: ${100 / event.group.columns.length * event.column}%;
					width: ${100 / event.group.columns.length * 0.5 * (1 + event.group.columns.length - event.column)}%;
				`;
		}

		// Content
		if (typeof $eventContent === 'function') {
			content = $eventContent({event});
		} else {
			switch (event.display) {
				case 'background':
					content = '';
					break;
				default:
					let intl = new Intl.DateTimeFormat(undefined, $timeFormat);
					content = `${event.title}<div class="${$theme.eventTitle}">${intl.format(event.start)} - ${intl.format(event.end)}</div>`;
			}
		}
	}

	function handleClick() {
		if (typeof $eventClick === 'function') {
			$eventClick({event, el});
		}
	}
</script>

<div bind:this="{el}" class="{className}" style="{style}" on:click={handleClick}>{@html content}</div>