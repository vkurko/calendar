import {assign, btnTextDay, btnTextMonth, btnTextWeek, nextClosestDay, prevClosestDay, themeView} from '#lib';
import View from './View.svelte';

export default {
    createOptions(options) {
        assign(options, {
            dayMaxEvents: false,
            dayCellFormat: {day: 'numeric'},
            dayPopoverFormat: {month: 'long', day: 'numeric', year: 'numeric'},
            moreLinkContent: undefined,
            weekNumbers: false,
            weekNumberContent: undefined,
            // Common options
            view: 'dayGridMonth'
        });
        assign(options.buttonText, {
            dayGridDay: 'day',
            dayGridMonth: 'month',
            dayGridWeek: 'week',
            close: 'Close'
        });
        assign(options.theme, {
            uniform: 'ec-uniform',
            dayFoot: 'ec-day-foot',
            otherMonth: 'ec-other-month',
            popup: 'ec-popup',
            weekNumber: 'ec-week-number'
        });
        assign(options.views, {
            dayGridDay: {
                buttonText: btnTextDay,
                component: () => View,
                dayHeaderFormat: {weekday: 'long'},
                displayEventEnd: false,
                duration: {days: 1},
                theme: themeView('ec-day-grid ec-day-view')
            },
            dayGridWeek: {
                buttonText: btnTextWeek,
                component: () => View,
                displayEventEnd: false,
                theme: themeView('ec-day-grid ec-week-view')
            },
            dayGridMonth: {
                buttonText: btnTextMonth,
                component: initMonthViewComponent,
                dayHeaderFormat: {weekday: 'short'},
                dayHeaderAriaLabelFormat: {weekday: 'long'},
                displayEventEnd: false,
                duration: {months: 1},
                theme: themeView('ec-day-grid ec-month-view'),
                titleFormat: {year: 'numeric', month: 'long'}
            }
        });
    }
}

function initMonthViewComponent(mainState) {
    mainState.features = ['dayNumber'];
    mainState.extensions.activeRange = (start, end) => {
        // Dependencies
        let {options: {firstDay}} = mainState;
        return {
            start: prevClosestDay(start, firstDay),
            end: nextClosestDay(end, firstDay)
        }
    };
    return View;
}
