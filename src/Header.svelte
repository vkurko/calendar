<script>
	import {getContext} from 'svelte';
	import {cloneDate} from './utils';

	let {date, dayHeaderFormat, theme} = getContext('store');

	let cols;

	$: {
		cols = [];
		let intl = new Intl.DateTimeFormat(undefined, $dayHeaderFormat);
		let day = cloneDate($date);
		while (day.getDay()) {
			day.setDate(day.getDate() - 1);
		}
		for (let i = 1; i <= 7; ++ i) {
			cols.push(intl.format(day));
			day.setDate(day.getDate() + 1);
		}
	}
</script>

<div class="{$theme.header}">
	<div class="{$theme.sidebar}"></div>
	{#each cols as col}
		<div class="{$theme.day}">{col}</div>
	{/each}
</div>