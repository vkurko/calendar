import {writable} from 'svelte/store';
import {writable2} from '../../storage/stores';
import View from './View.svelte';

export default {
	createOptions(options) {
		options.resources = [];
		options.filterResourcesWithEvents = false;
		options.view = 'resourceTimeGridWeek';
		options.views.resourceTimeGridDay = {
			component: View,
			duration: {days: 1}
		};
		options.views.resourceTimeGridWeek = {
			component: View,
			duration: {weeks: 1}
		};
		options.buttonText.resourceTimeGridDay = 'day';
		options.buttonText.resourceTimeGridWeek = 'week';
		options.theme.resource = 'ec-resource ec-grow';
	},
	createStores(state, options) {
		state.resources = writable2(options.resources, createResources);
		state.filterResourcesWithEvents = writable(options.filterResourcesWithEvents);
	}
}

function createResources(input) {
	return input.map(resource => ({
		id: String(resource.id),
		title: resource.title || ''
	}));
}