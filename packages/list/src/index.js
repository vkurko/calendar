import View from './View.svelte';

export default {
	createOptions(options) {
		// Common options
		options.buttonText.listDay = 'list';
		options.buttonText.listWeek = 'list';
		options.buttonText.listMonth = 'list';
		options.buttonText.listYear = 'list';
		options.listDayFormat = {weekday: 'long'};
		options.listDaySideFormat = {year: 'numeric', month: 'long', day: 'numeric'};
		options.noEventsClick = undefined;  // ec option
		options.noEventsContent = 'No events';
		options.theme.daySide = 'ec-day-side';
		options.theme.eventTag = 'ec-event-tag';
		options.theme.list = 'ec-list';
		options.theme.noEvents = 'ec-no-events';
		options.view = 'listWeek';
		options.views.listDay = {
			component: View,
			duration: {days: 1}
		};
		options.views.listWeek = {
			component: View,
			duration: {weeks: 1}
		};
		options.views.listMonth = {
			component: View,
			duration: {months: 1}
		};
		options.views.listYear = {
			component: View,
			duration: {years: 1}
		};
	}
}