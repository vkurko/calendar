import {btnTextDay, btnTextMonth, btnTextWeek, themeView} from '#lib';
import {dayTimeLimits, daySlots, nestedResources, monthView} from './stores.js';
import {createTRROptions, createTRRParsers} from '../time-grid/options.js';
import {createTRRStores} from '../time-grid/stores.js';
import {createRROptions} from '../resource-time-grid/options.js';
import {createRRStores} from '../resource-time-grid/stores.js';
import View from './View.svelte';

export default {
	createOptions(options) {
        createTRROptions(options);
        createRROptions(options);
        options.slotWidth = 16;
		// Common options
		options.buttonText.resourceTimelineDay = 'timeline';
		options.buttonText.resourceTimelineWeek = 'timeline';
		options.buttonText.resourceTimelineMonth = 'timeline';
		options.theme.expander = 'ec-expander';
        options.theme.rowHead = 'ec-row-head';
		options.theme.slots = 'ec-slots';
		options.view = 'resourceTimelineWeek';
		options.views.resourceTimelineDay = {
			buttonText: btnTextDay,
			component: View,
			displayEventEnd: false,
			dayHeaderFormat: {weekday: 'long'},
			duration: {days: 1},
            slotLabelInterval: '01:00',
			slotDuration: '00:15',
			theme: themeView('ec-resource ec-timeline ec-day-view'),
			titleFormat: {year: 'numeric', month: 'long', day: 'numeric'}
		};
		options.views.resourceTimelineWeek = {
			buttonText: btnTextWeek,
			component: View,
			displayEventEnd: false,
			duration: {weeks: 1},
            slotLabelInterval: '01:00',
			slotDuration: '00:15',
			theme: themeView('ec-resource ec-timeline ec-week-view')
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
			theme: themeView('ec-resource ec-timeline ec-month-view'),
			titleFormat: {year: 'numeric', month: 'long'}
		};
	},

    createParsers(parsers) {
        createTRRParsers(parsers);
    },

	createStores(state) {
		createTRRStores(state);
        createRRStores(state);
		state._dayTimeLimits = dayTimeLimits(state);  // flexible time limits per day
        state._daySlots = daySlots(state);
        state._monthView = monthView(state);
		state._nestedResources = nestedResources(state);
	}
}
