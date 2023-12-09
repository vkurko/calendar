import {btnTextDay, btnTextWeek, themeView} from '@event-calendar/core';
import TimeGrid from '@event-calendar/time-grid';
import {viewResources} from './stores.js';
import {createResources} from './lib.js';
import View from './View.svelte';
import Auxiliary from './Auxiliary.svelte';

export default {
	createOptions(options) {
		options.resources = [];
		options.datesAboveResources = false;
		options.filterResourcesWithEvents = false;
		options.resourceLabelContent = undefined;
		options.resourceLabelDidMount = undefined;
		// Common options
		options.buttonText.resourceTimeGridDay = 'day';
		options.buttonText.resourceTimeGridWeek = 'week';
		options.theme.resource = 'ec-resource';
		options.theme.resourceTitle = 'ec-resource-title';
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
