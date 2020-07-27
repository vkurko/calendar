import View from './View.svelte';

export default {
	createOptions(options) {
		options.view = 'dayGridMonth';
		options.views.dayGridMonth = {
			component: View,
			duration: {months: 1},
			monthMode: true,
			titleFormat: {year: 'numeric', month: 'long'},
			dayHeaderFormat: {weekday: 'short'}
		};
		options.buttonText.dayGridMonth = 'month';
		options.theme.month = 'ec-month';
	},
	createStores(state, options) {

	}
}