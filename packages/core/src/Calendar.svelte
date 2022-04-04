<script>
	import './index.scss';
	import {setContext} from 'svelte';
	import {get} from 'svelte/store';
	import {diff} from './storage/options';
	import State from './storage/state';
	import Toolbar from './Toolbar.svelte';
	import {assign, toEventWithLocalDates, toViewWithLocalDates} from '@event-calendar/common';

	export let plugins = [];
	export let options = {};

	let state = new State(plugins, options);
	setContext('state', state);

	let {_viewComponent, _interaction, _events, events, eventSources, height, theme} = state;

	// Reactively update options that did change
	$: for (let [name, value] of diff(options)) {
		setOption(name, value);
	}

	export function setOption(name, value) {
		if (state.hasOwnProperty(name)) {
			if (state[name].parse) {
				value = state[name].parse(value);
			}
			state[name].set(value);
		}
		return this;
	}

	export function getOption(name) {
		return state.hasOwnProperty(name) ? get(state[name]) : undefined;
	}

	export function refetchEvents() {
		state._fetchedRange.set({start: undefined, end: undefined});
		return this;
	}

	export function getEvents() {
		return get(state._events).map(toEventWithLocalDates);
	}

	export function getEventById(id) {
		for (let event of get(state._events)) {
			if (event.id == id) {
				return toEventWithLocalDates(event);
			}
		}
		return null;
	}

	export function addEvent(event) {
		updateEvents(events => events.concat(state.events.parse([event])));
		return this;
	}

	export function updateEvent(event) {
		updateEvents(events => {
			for (let e of events) {
				if (e.id == event.id) {
					assign(e, state.events.parse([event])[0]);
					break;
				}
			}
			return events;
		});
		return this;
	}

	export function removeEventById(id) {
		updateEvents(events => events.filter(event => event.id != id));
		return this;
	}

	export function getView() {
		return toViewWithLocalDates(state._view.get());
	}

	function updateEvents(func) {
		if ($eventSources.length) {
			$_events = func($_events);
		} else {
			$events = func($events);
		}
	}
</script>

<div class="{$theme.calendar}" style="height: {$height}">
	<Toolbar/>
	<svelte:component this={$_viewComponent}/>
	<svelte:component this={$_interaction.component}/>
</div>
