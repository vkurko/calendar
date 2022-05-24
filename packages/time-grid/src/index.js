import View from './View.svelte';

export {default as State} from './state';
export {default as Header} from './Header.svelte';
export {default as Body} from './Body.svelte';
export {default as Day} from './Day.svelte';
export {default as Week} from './all-day/Week.svelte';

export default {
	createOptions(options) {
		// Common options
		options.buttonText.timeGridDay = 'day';
		options.buttonText.timeGridWeek = 'week';
		options.view = 'timeGridWeek';
		options.views.timeGridDay = {
			component: View,
			dayHeaderFormat: {weekday: 'long'},
			duration: {days: 1},
			titleFormat: {year: 'numeric', month: 'long', day: 'numeric'}
		};
		options.views.timeGridWeek = {
			component: View,
			duration: {weeks: 1}
		};
	}
}