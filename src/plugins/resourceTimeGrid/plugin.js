import {writable} from 'svelte/store';
import View from './View.svelte';

export default {
	extendDefaultOptions(options) {
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
		options.theme.resource = 'resource grow';
	},
	createStoresForOptions(obj, options) {
		obj.resources = writable(options.resources);
	}
}