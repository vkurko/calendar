import {writable} from 'svelte/store';
import {btnTextDay, btnTextWeek, themeView} from '@event-calendar/core';
import {dayTimeLimits, dayTimes} from './stores.js';
import View from './View.svelte';

export default {
	createOptions(options) {
		// Common options
		options.buttonText.resourceTimelineDay = 'timeline';
		options.buttonText.resourceTimelineWeek = 'timeline';
		options.dayHeaderAriaLabelFormat = {
			dateStyle: 'long',
			timeStyle: 'short'
		};
		options.theme.main = 'ec-main';
		options.theme.times = 'ec-times';
		options.theme.container = 'ec-container';
		options.view = 'resourceTimelineWeek';
		options.views.resourceTimelineDay = {
			buttonText: btnTextDay,
			component: View,
			dayHeaderFormat: {weekday: 'long'},
			duration: {days: 1},
			slotDuration: '01:00',
			theme: themeView('ec-timeline ec-resource-day-view'),
			titleFormat: {year: 'numeric', month: 'long', day: 'numeric'}
		};
		options.views.resourceTimelineWeek = {
			buttonText: btnTextWeek,
			component: View,
			displayEventEnd: false,
			duration: {weeks: 1},
			slotDuration: '01:00',
			theme: themeView('ec-timeline ec-resource-week-view')
		};
	},

	createStores(state) {
		state._headerEl = writable(undefined);
		state._dayTimeLimits = dayTimeLimits(state);  // flexible time limits per day
		state._dayTimes = dayTimes(state);
		state._resHs = writable(new Map());  // resource row heights
		state._sidebarEl = writable(undefined);
	}
}
