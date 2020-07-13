<script>
	import {setContext} from 'svelte';
	import {get} from 'svelte/store';
	import State from './options/state';
	import Toolbar from './Toolbar.svelte';
	import {assign} from './utils';

	export let options;

	let state = new State(options);
	setContext('state', state);

	let {_viewComponent, height, theme} = state;

	export function setOption(name, value) {
		if (state.hasOwnProperty(name)) {
			if (state[name].mutate) {
				value = state[name].mutate(value);
			}
			state[name].set(value);
		}
	}

	export function getOption(name) {
		return state.hasOwnProperty(name) ? get(state[name]) : undefined;
	}

	export function refetchEvents() {
		state._fetchedRange.set({start: undefined, end: undefined});
	}

	export function getEventById(id) {
		for (let event of get(state._events)) {
			if (event.id == id) {
				return event;
			}
		}
		return null;
	}

	export function addEvent(event) {
		state._events.update(events => events.concat(state.events.mutate([event])));
	}

	export function updateEvent(event) {
		state._events.update(events => {
			for (let e of events) {
				if (e.id == event.id) {
					assign(e, state.events.mutate([event])[0]);
					break;
				}
			}
			return events;
		});
	}

	export function removeEvent(eventId) {
		state._events.update(events => events.filter(event => event.id != eventId));
	}
</script>

<div class="{$theme.calendar}" style="height: {$height}">
	<Toolbar/>
	<svelte:component this={$_viewComponent}/>
</div>

<style>
	:global(.ec-flex) {
		display: flex;
	}
	:global(.ec-grow) {
		flex: 1 1 0;
		min-width: 0;
		max-width: 100%;
	}
	:global(.ec-no-grow) {
		flex: 0 0 auto;
		width: auto;
		max-width: 100%;
	}
	:global(.ec) {
		display: flex;
		flex-direction: column;
	}
	:global(.ec ::-webkit-scrollbar) {
		background: #fff;
	}
	:global(.ec ::-webkit-scrollbar-thumb) {
		border: 4px solid #fff;
		box-shadow: none;
		background: #dadce0;
		border-radius: 8px;
		min-height: 40px;
	}
	:global(.ec :hover::-webkit-scrollbar-thumb) {
		background: #bdc1c6;
	}
	:global(.ec-toolbar) {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1em;
	}
	:global(.ec-toolbar > * > :not(:first-child)) {
		margin-left: .75em;
	}
	:global(.ec-title) {
		margin: 0;
	}
	:global(.ec-button) {
		background-color: #fff;
		border: 1px solid #ced4da;
		padding: .375rem .75rem;
		font-size: 1rem;
		line-height: 1.5;
		border-radius: .25rem;
	}
	:global(.ec-button:not(:disabled)) {
		color: #212529;
		cursor: pointer;
	}
	:global(.ec-button:not(:disabled):hover) {
		background-color: #ececec;
		border-color: #b1bbc4;
	}
	:global(.ec-button-group) {
		display: inline-block;
	}
	:global(.ec-button-group .ec-button:not(:first-child)) {
		border-top-left-radius: 0;
		border-bottom-left-radius: 0;
		margin-left: -1px;
	}
	:global(.ec-button-group .ec-button:not(:last-child)) {
		border-top-right-radius: 0;
		border-bottom-right-radius: 0;
	}
	:global(.ec-icon) {
		display: inline-block;
		width: 1em;
	}
	:global(.ec-icon.ec-prev:after, .ec-icon.ec-next:after) {
		content: '';
		position: relative;
		width: .5em;
		height: .5em;
		border-top: 2px solid #212529;
		border-right: 2px solid #212529;
		display: inline-block;
	}
	:global(.ec-icon.ec-prev:after) {
		transform: rotate(-135deg) translate(-2px, 2px);
	}
	:global(.ec-icon.ec-next:after) {
		transform: rotate(45deg) translate(-2px, 2px);
	}
	:global(.ec-header, .ec-body) {
		border: 1px solid #dadce0;
	}
	:global(.ec-header) {
		display: flex;
	}
	:global(.ec-header.ec-with-scroll:after) {
		content: '';
		overflow-y: scroll;
		visibility: hidden;
		flex-shrink: 0;
	}
	:global(.ec-body) {
		position: relative;
		overflow: hidden auto;
		border-top-width: 0;
	}
	:global(.ec-sidebar) {
		padding: 0 4px 0 8px;
	}
	:global(.ec-content) {
		display: flex;
	}
	:global(.ec-resource) {
		display: flex;
	}
	:global(.ec-column) {
		border-width: 0 0 0 1px;
		border-style: solid;
		border-color: #dadce0;
		overflow: hidden;
	}
	:global(.ec-column.ec-today) {
		background-color: #fcf8e3;
	}
	:global(.ec-column.ec-highlight) {
		background-color: #e5f7fe;
	}
	:global(.ec-header .ec-resource) {
		flex-direction: column;
	}
	:global(.ec-header .ec-column) {
		min-height: 24px;
		line-height: 24px;
		text-align: center;
	}
	:global(.ec-events) {
		position: relative;
		margin: 0 6px 0 0;
	}
	:global(.ec-event) {
		position: absolute;
		padding: 1px 2px;
		box-sizing: border-box;
		box-shadow: 0 0 1px 0 #dadce0;
		background-color: #039be5;
		border-radius: 3px;
		font-size: .85em;
		line-height: 1.3;
		font-weight: 400;
		overflow: hidden;
	}
	:global(.ec-event-content) {
		position: relative;
		color: #fff
	}
	:global(.ec-event-time) {
		overflow: hidden;
		white-space: nowrap;
		font-size: .85em;
		margin-bottom: 1px;
	}
	:global(.ec-bg-events) {
		position: relative;
	}
	:global(.ec-bg-event) {
		position: absolute;
		background-color: #dadce0;
		opacity: 0.3;
		width: 100%;
	}
	:global(.ec-hidden-times) {
		visibility: hidden;
		overflow-y: hidden;
		height: 0;
	}
	:global(.ec-time, .ec-line) {
		height: 24px;
	}
	:global(.ec-time) {
		position: relative;
		line-height: 24px;
		top: -12px;
		text-align: right;
		white-space: nowrap;
	}
	:global(.ec-lines) {
		width: 8px;
	}
	:global(.ec-line:not(:first-child):after) {
		content: '';
		position: absolute;
		width: 100%;
		border-bottom: 1px solid #dadce0;
	}
	:global(.ec-body:not(.ec-compact) .ec-line:nth-child(even):after) {
		border-bottom-style: dotted;
	}
</style>