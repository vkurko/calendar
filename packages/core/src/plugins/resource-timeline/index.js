import {assign, btnTextDay, btnTextMonth, btnTextWeek, btnTextYear, getPayload, themeView} from '#lib';
import {setExtensions} from '../time-grid/lib.js';
import {createTRROptions, createTRRParsers} from '../time-grid/options.js';
import {createRROptions} from '../resource-time-grid/options.js';
import View from './View.svelte';

export default {
	createOptions(options) {
        createTRROptions(options);
        createRROptions(options);
		assign(options, {
			monthHeaderFormat: {  // ec option
				month: 'long'
			},
			beforeResourceExpand: undefined, // ec option
			resourceExpand: undefined,  // ec option
			slotWidth: 32,  // ec option
			// Common options
			view: 'resourceTimelineWeek'
		});
		assign(options.buttonText, {
			expand: 'Expand',
			collapse: 'Collapse',
			resourceTimelineDay:  'day',
			resourceTimelineWeek: 'week',
			resourceTimelineMonth: 'month',
			resourceTimelineYear: 'year'
		});
		assign(options.icons, {
			collapse: {html: '&minus;'},
			expand: {html: '&plus;'}
		});
		assign(options.theme, {
			expander: 'ec-expander',
			rowHead: 'ec-row-head',
			slots: 'ec-slots'
		});
		assign(options.views, {
			resourceTimelineDay: {
				buttonText: btnTextDay,
				component: initViewComponent,
				displayEventEnd: false,
				dayHeaderFormat: {weekday: 'long'},
				duration: {days: 1},
				theme: themeView('ec-resource ec-timeline ec-day-view'),
				titleFormat: {year: 'numeric', month: 'long', day: 'numeric'}
			},
			resourceTimelineWeek: {
				buttonText: btnTextWeek,
				component: initViewComponent,
				displayEventEnd: false,
				duration: {weeks: 1},
				theme: themeView('ec-resource ec-timeline ec-week-view')
			},
			resourceTimelineMonth: {
				buttonText: btnTextMonth,
				component: initMonthViewComponent,
				displayEventEnd: false,
				dayHeaderFormat: {
					weekday: 'short',
					day: 'numeric'
				},
				duration: {months: 1},
				slotDuration: {days: 1},
				theme: themeView('ec-resource ec-timeline ec-month-view'),
				titleFormat: {year: 'numeric', month: 'long'}
			},
			resourceTimelineYear: {
				buttonText: btnTextYear,
				component: initMonthViewComponent,
				displayEventEnd: false,
				dayHeaderFormat: {
					weekday: 'short',
					day: 'numeric'
				},
				duration: {years: 1},
				slotDuration: {days: 1},
				theme: themeView('ec-resource ec-timeline ec-year-view'),
				titleFormat: {year: 'numeric'}
			}
		});
	},

    createParsers(parsers) {
        createTRRParsers(parsers);
    }
}

function initViewComponent(mainState) {
	setExtensions(mainState);
	return _initViewComponent(mainState);
}

function initMonthViewComponent(mainState) {
	return _initViewComponent(mainState, ['month']);
}

function _initViewComponent(mainState, extraFeatures = []) {
	mainState.features = ['timeline', ...extraFeatures];
	mainState.extensions.viewResources = resources => resources.filter(resource => !getPayload(resource).hidden);
	return View;
}
