import View from './View.svelte';

export default {
	createInitOptions(options) {
		options.view = 'timeGridWeek';
		options.views.timeGridDay = {
			component: View,
			duration: {days: 1},
			dayHeaderFormat: {weekday: 'long'}
		};
		options.views.timeGridWeek = {
			component: View,
			duration: {weeks: 1}
		};
		options.buttonText.timeGridDay = 'day';
		options.buttonText.timeGridWeek = 'week';
	},
	createStoresForOptions(obj, options) {

	}
}