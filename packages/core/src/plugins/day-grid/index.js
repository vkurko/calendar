import {assign, btnTextMonth, nextClosestDay, prevClosestDay, themeView} from '#lib';
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
            dayGridMonth: 'month',
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
            dayGridMonth: {
                buttonText: btnTextMonth,
                component: initViewComponent,
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

function initViewComponent(mainState) {
    mainState.features = ['day-grid'];
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
