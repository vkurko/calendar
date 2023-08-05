import {btnTextDay, btnTextWeek, btnTextMonth, btnTextYear, intl} from '@event-calendar/core';
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
			buttonText: btnTextDay,
			component: View,
			duration: {days: 1}
		};
		options.views.listWeek = {
			buttonText: btnTextWeek,
			component: View,
			duration: {weeks: 1}
		};
		options.views.listMonth = {
			buttonText: btnTextMonth,
			component: View,
			duration: {months: 1}
		};
		options.views.listYear = {
			buttonText: btnTextYear,
			component: View,
			duration: {years: 1}
		};
	},

	createStores(state) {
		state._intlListDayFormat = intl(state.locale, state.listDayFormat);
		state._intlListDaySideFormat = intl(state.locale, state.listDaySideFormat);
	}
}
