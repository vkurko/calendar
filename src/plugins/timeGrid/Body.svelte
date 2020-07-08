<script>
	import {getContext} from 'svelte';
	import {modifyDate} from '../../utils';

	let {slotDuration, timeFormat, theme} = getContext('options');

	let times;
	let lines;

	$: {
		times = [];
		lines = [];
		let intl = new Intl.DateTimeFormat(undefined, $timeFormat);
		let date = new Date('2020-01-01 00:00:00');
		let end = new Date('2020-01-02 00:00:00');
		while (date < end) {
			times.push(times.length ? intl.format(date) : '');
			modifyDate(date, $slotDuration);
		}
		lines.length = times.length;
	}
</script>

<div class="{$theme.body}">
	<div class="{$theme.flex}">
		<div class="{$theme.sidebar}">
			{#each times as time}
				<div class="{$theme.time}">{time}</div>
			{/each}
		</div>
		<div class="{$theme.content}">
			<div class="{$theme.lines}">
				{#each lines as line}
					<div class="{$theme.line}"></div>
				{/each}
			</div>
			<slot></slot>
		</div>
	</div>
</div>