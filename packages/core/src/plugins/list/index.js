import {btnTextDay, btnTextWeek, btnTextMonth, btnTextYear, intl, themeView} from '#lib';
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
        options.theme.noEvents = 'ec-no-events';
        options.view = 'listWeek';
        options.views.listDay = {
            buttonText: btnTextDay,
            component: View,
            duration: {days: 1},
            theme: themeView('ec-list ec-day-view')
        };
        options.views.listWeek = {
            buttonText: btnTextWeek,
            component: View,
            duration: {weeks: 1},
            theme: themeView('ec-list ec-week-view')
        };
        options.views.listMonth = {
            buttonText: btnTextMonth,
            component: View,
            duration: {months: 1},
            theme: themeView('ec-list ec-month-view')
        };
        options.views.listYear = {
            buttonText: btnTextYear,
            component: View,
            duration: {years: 1},
            theme: themeView('ec-list ec-year-view')
        };
    },

    createStores(state) {
        state._intlListDay = intl(state.locale, state.listDayFormat);
        state._intlListDaySide = intl(state.locale, state.listDaySideFormat);
    }
}
