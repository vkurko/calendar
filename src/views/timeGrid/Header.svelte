<script>
	import {getContext} from 'svelte';
	import {cloneDate, modifyDate} from '../../utils';

	let {date: currentDate, dayHeaderFormat, duration, theme} = getContext('options');

	let cols;

	$: {
		cols = [];
		let intl = new Intl.DateTimeFormat(undefined, $dayHeaderFormat);
		let date = cloneDate($currentDate);
		if ($duration.inWeeks) {
			// First day of week
			while (date.getDay()) {
				date.setDate(date.getDate() - 1);
			}
		}
		let end = cloneDate(date);
		modifyDate(end, $duration);
		while (date < end) {
			cols.push(intl.format(date));
			date.setDate(date.getDate() + 1);
		}
	}
</script>

<div class="{$theme.header}">
	<div class="{$theme.sidebar}"></div>
	{#each cols as col}
		<div class="{$theme.day}">{col}</div>
	{/each}
</div>