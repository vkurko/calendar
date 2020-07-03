<script>
	import {getContext} from 'svelte';
	import {cloneDate, modifyDate} from './utils';
	import Day from './Day.svelte';

	let {date, slotDuration, timeFormat, theme} = getContext('store');

	let times;
	let lines;
	let days;

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

	$: {
		days = [];
		let day = cloneDate($date);
		while (day.getDay()) {
			day.setDate(day.getDate() - 1);
		}
		for (let i = 0; i < 7; ++ i) {
			days.push(cloneDate(day));
			day.setDate(day.getDate() + 1);
		}
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
			{#each days as day}
				<Day {day}/>
			{/each}
		</div>
	</div>
</div>