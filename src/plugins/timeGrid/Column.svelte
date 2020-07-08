<script>
	import {getContext} from 'svelte';
	import {cloneDate} from '../../utils';
	import Event from './Event.svelte';

	export let date;
	export let resourceId = undefined;

	let {events: allEvents, theme} = getContext('options');

	let events, bgEvents;

	$: {
		events = [];
		bgEvents = [];
		let start = cloneDate(date);
		let end = cloneDate(date);
		start.setHours(0, 0, 0, 0);
		end.setHours(24, 0, 0, 0);
		for (let event of $allEvents) {
			if (event.start < end && event.end > start && (resourceId === undefined || event.resourceIds.includes(resourceId))) {
				let e = {
					id: event.id,
					resourceIds: event.resourceIds,
					start: event.start > start ? event.start : start,
					end: event.end < end ? event.end : end,
					title: event.title,
					display: event.display
				};
				switch (e.display) {
					case 'background': bgEvents.push(e); break;
					default: events.push(e);
				}
			}
		}

		groupEvents(events);
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

<div class="{$theme.column}">
	<div class="{$theme.bgEvents}">
		{#each bgEvents as event}
			<Event {event}/>
		{/each}
	</div>
	<div class="{$theme.events}">
		{#each events as event}
			<Event {event}/>
		{/each}
	</div>
</div>