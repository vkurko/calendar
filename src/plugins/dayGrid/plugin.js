import View from './View.svelte';

export default {
	createOptions(options) {
		// Common options
		options.buttonText.dayGridMonth = 'month';
		options.theme.month = 'ec-month';
		options.view = 'dayGridMonth';
		options.views.dayGridMonth = {
			component: View,
			dayHeaderFormat: {weekday: 'short'},
			displayEventEnd: false,
			duration: {months: 1},
			monthMode: true,
			titleFormat: {year: 'numeric', month: 'long'}
		};
	}
}