import {writable} from 'svelte/store';
import View from './View.svelte';

export default {
	createInitOptions(options) {
		options.resources = [];
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
	createStoresForOptions(obj, options) {
		obj.resources = writable(options.resources);
	}
}