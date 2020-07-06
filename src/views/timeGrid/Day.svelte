<script>
	import {getContext} from 'svelte';
	import {cloneDate} from '../../utils';
	import Event from './Event.svelte';

	export let day;

	let {events, theme} = getContext('options');

	let dayEvents, dayBgEvents;

	$: {
		dayEvents = [];
		dayBgEvents = [];
		let start = cloneDate(day);
		let end = cloneDate(day);
		start.setHours(0, 0, 0, 0);
		end.setHours(24, 0, 0, 0);
		for (let event of $events) {
			if (event.start < end && event.end > start) {
				let e = {
					id: event.id,
					start: event.start > start ? event.start : start,
					end: event.end < end ? event.end : end,
					title: event.title,
					display: event.display
				};
				switch (e.display) {
					case 'background': dayBgEvents.push(e); break;
					default: dayEvents.push(e);
				}
			}
		}

		groupEvents(dayEvents);
	}

	function groupEvents(events) {
		if (!events.length) {
			return;
		}

		// Sort by start date
		events.sort((a, b) => {
			if (a.start < b.start) {
				return -1;
			}
			if (a.start > b.start) {
				return 1;
			}
			return 0;
		});

		// Group
		let group = {
			columns: [],
			end: events[0].end
		};
		for (let event of events) {
			let c = 0;
			if (event.start < group.end) {
				for (; c < group.columns.length; ++c) {
					if (group.columns[c][group.columns[c].length - 1].end <= event.start) {
						break;
					}
				}
				if (event.end > group.end) {
					group.end = event.end;
				}
			} else {
				group = {
					columns: [],
					end: event.end
				};
			}

			if (group.columns.length < c + 1) {
				group.columns.push([]);
			}
			group.columns[c].push(event);

			event.group = group;
			event.column = c;
		}
	}
</script>

<div class="{$theme.day}">
	<div class="{$theme.bgEvents}">
		{#each dayBgEvents as event}
			<Event {event}/>
		{/each}
	</div>
	<div class="{$theme.events}">
		{#each dayEvents as event}
			<Event {event}/>
		{/each}
	</div>
</div>