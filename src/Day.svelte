<script>
	import {getContext} from 'svelte';
	import Event from './Event.svelte';

	export let day;

	let {date, events, theme} = getContext('store');

	let dayEvents;

	$: {
		dayEvents = [];
		let start = new Date(day.getFullYear(), day.getMonth(), day.getDate());
		let end = new Date(day.getFullYear(), day.getMonth(), day.getDate() + 1);
		for (let event of $events) {
			if (event.start < end && event.end > start) {
				dayEvents.push({
					id: event.id,
					start: event.start > start ? event.start : start,
					end: event.end < end ? event.end : end
				});
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

	// setTimeout(() => $events = [{start: new Date('2020-07-02 12:00'), end: new Date('2020-07-02 15:00')}], 1000);
	// setTimeout(() => $date = '2020-07-05', 2000);
</script>

<div class="{$theme.day}">
	<div class="{$theme.events}">
		{#each dayEvents as event}
			<Event {event}/>
		{/each}
	</div>
</div>