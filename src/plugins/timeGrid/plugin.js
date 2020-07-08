import {createDuration} from '../../utils';
import * as stores from '../../options/stores';
import View from './View.svelte';

export default {
	extendDefaultOptions(options) {
		options.slotDuration= {hours: 1};
		options.view = 'timeGridWeek';
		options.views.timeGridDay = {
			component: View,
			duration: {days: 1}
		};
		options.views.timeGridWeek = {
			component: View,
			duration: {weeks: 1}
		};
	},
	createStoresForOptions(obj, options) {
		obj.slotDuration = stores.duration(createDuration(options.slotDuration));
	}
}