import {assign, btnTextDay, btnTextMonth, btnTextWeek, getPayload, themeView} from '#lib';
import {setExtensions} from '../time-grid/lib.js';
import {createTRROptions, createTRRParsers} from '../time-grid/options.js';
import {createRROptions} from '../resource-time-grid/options.js';
import View from './View.svelte';

export default {
	createOptions(options) {
        createTRROptions(options);
        createRROptions(options);
		assign(options, {
			resourceExpand: undefined,
			slotWidth: 32,
			// Common options
			view: 'resourceTimelineWeek'
		});
		assign(options.buttonText, {
			expand: 'Expand',
			collapse: 'Collapse',
			resourceTimelineDay:  'timeline',
			resourceTimelineWeek: 'timeline',
			resourceTimelineMonth: 'timeline'
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
			}
		});
	},

    createParsers(parsers) {
        createTRRParsers(parsers);
    }
}

function initViewComponent(mainState) {
	setExtensions(mainState);
	return initMonthViewComponent(mainState);
}

function initMonthViewComponent(mainState) {
	mainState.features = ['timeline'];
	mainState.extensions.viewResources = resources => resources.filter(resource => !getPayload(resource).hidden);
	return View;
}
