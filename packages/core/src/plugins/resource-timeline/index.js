import {writable} from 'svelte/store';
import {btnTextDay, btnTextMonth, btnTextWeek, themeView, viewResources} from '#lib';
import {dayTimeLimits, dayTimes, nestedResources} from './stores.js';
import View from './View.svelte';

export default {
	createOptions(options) {
		// Common options
		options.buttonText.resourceTimelineDay = 'timeline';
		options.buttonText.resourceTimelineWeek = 'timeline';
		options.buttonText.resourceTimelineMonth = 'timeline';
		options.theme.expander = 'ec-expander';
		options.theme.main = 'ec-main';
		options.theme.times = 'ec-times';
		options.theme.container = 'ec-container';
		options.view = 'resourceTimelineWeek';
		options.views.resourceTimelineDay = {
			buttonText: btnTextDay,
			component: View,
			displayEventEnd: false,
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
		options.views.resourceTimelineMonth = {
			buttonText: btnTextMonth,
			component: View,
			displayEventEnd: false,
			dayHeaderFormat: {
				weekday: 'short',
				day: 'numeric'
			},
			duration: {months: 1},
			slotDuration: {days: 1},
			theme: themeView('ec-timeline ec-resource-month-view'),
			titleFormat: {year: 'numeric', month: 'long'}
		};
	},

	createStores(state) {
		if (!('_viewResources' in state)) {
			state._viewResources = viewResources(state);
		}
		state._headerEl = writable(undefined);
		state._headerHeight = writable(0);
		state._dayTimeLimits = dayTimeLimits(state);  // flexible time limits per day
		state._dayTimes = dayTimes(state);
		state._nestedResources = nestedResources(state);
		state._resHs = writable(new Map());  // resource row heights
		state._sidebarEl = writable(undefined);
	}
}
