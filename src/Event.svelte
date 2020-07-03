<script>
	import {getContext} from 'svelte';

	export let event;

	let {slotDuration, theme} = getContext('store');

	let style;

	$: {
		let step = $slotDuration.hours * 60 + $slotDuration.minutes;
		let start = event.start.getHours() * 60 + event.start.getMinutes();
		let end = event.end.getDate() > event.start.getDate() ? 24 * 60 : (event.end.getHours() * 60 + event.end.getMinutes())
		style = {
			top: 40 * (start / step),
			height: 40 * ((end - start) / step),
			width: 100 / event.group.columns.length * (event.column < event.group.columns.length - 1 ? 1.5 : 1),
			left: 100 / event.group.columns.length * event.column,
			zIndex: event.column
		};
	}
</script>

<div class="{$theme.event}" style="top: {style.top}px; height: {style.height}px; width: {style.width}%; left: {style.left}%; z-index: {style.zIndex}">
	{event.start.getHours()}
</div>