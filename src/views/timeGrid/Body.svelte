<script>
	import {getContext} from 'svelte';
	import {cloneDate, modifyDate} from '../../utils';
	import Day from './Day.svelte';

	let {date: currentDate, slotDuration, timeFormat, duration, theme} = getContext('options');

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
			days.push(cloneDate(date));
			date.setDate(date.getDate() + 1);
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