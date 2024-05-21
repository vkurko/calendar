import {btnTextDay, btnTextWeek, themeView} from '@event-calendar/core';
import TimeGrid from '@event-calendar/time-grid';
import {viewResources} from './stores.js';
import {createResources} from './lib.js';
import View from './View.svelte';
import Auxiliary from './Auxiliary.svelte';

export default {
	createOptions(options) {
		options.datesAboveResources = false;
		options.filterResourcesWithEvents = false;
		// Common options
		options.buttonText.resourceTimeGridDay = 'resources';
		options.buttonText.resourceTimeGridWeek = 'resources';
		options.view = 'resourceTimeGridWeek';
		options.views.resourceTimeGridDay = {
			buttonText: btnTextDay,
			component: View,
			duration: {days: 1},
			theme: themeView('ec-time-grid ec-resource-day-view')
		};
		options.views.resourceTimeGridWeek = {
			buttonText: btnTextWeek,
			component: View,
			duration: {weeks: 1},
			theme: themeView('ec-time-grid ec-resource-week-view')
		};
	},

	createParsers(parsers) {
		parsers.resources = createResources;
	},

	createStores(state) {
		if (!('_times' in state)) {
			TimeGrid.createStores(state);
		}
		state._auxiliary.update($_auxiliary => [...$_auxiliary, Auxiliary]);
		state._viewResources = viewResources(state);
	}
}
