import {btnTextDay, btnTextWeek, btnTextMonth, btnTextYear, themeView, assign} from '#lib';
import View from './View.svelte';

export default {
    createOptions(options) {
        assign(options, {
            listDayFormat: {weekday: 'long'},
            listDaySideFormat: {year: 'numeric', month: 'long', day: 'numeric'},
            noEventsClick: undefined,  // ec option
            noEventsContent: 'No events',
            // Common options
            view: 'listWeek'
        });
        assign(options.buttonText, {
            listDay: 'list',
            listWeek: 'list',
            listMonth: 'list',
            listYear: 'list'
        });
        assign(options.theme, {
            daySide: 'ec-day-side',
            eventTag: 'ec-event-tag',
            noEvents: 'ec-no-events'
        });
        assign(options.views, {
            listDay: {
                buttonText: btnTextDay,
                component: initViewComponent,
                duration: {days: 1},
                theme: themeView('ec-list ec-day-view')
            },
            listWeek: {
                buttonText: btnTextWeek,
                component: initViewComponent,
                duration: {weeks: 1},
                theme: themeView('ec-list ec-week-view')
            },
            listMonth: {
                buttonText: btnTextMonth,
                component: initViewComponent,
                duration: {months: 1},
                theme: themeView('ec-list ec-month-view')
            },
            listYear: {
                buttonText: btnTextYear,
                component: initViewComponent,
                duration: {years: 1},
                theme: themeView('ec-list ec-year-view')
            }
        });
    }
}

function initViewComponent(mainState) {
    mainState.features = ['list'];
    return View;
}
