import {btnTextDay, btnTextMonth, btnTextWeek, getPayload, themeView} from '#lib';
import {setExtensions} from '../time-grid/lib.js';
import {createTRROptions, createTRRParsers} from '../time-grid/options.js';
import {createRROptions} from '../resource-time-grid/options.js';
import View from './View.svelte';

export default {
	createOptions(options) {
        createTRROptions(options);
        createRROptions(options);
        options.slotWidth = 32;
		// Common options
		options.buttonText.resourceTimelineDay = 'timeline';
		options.buttonText.resourceTimelineWeek = 'timeline';
		options.buttonText.resourceTimelineMonth = 'timeline';
		options.theme.expander = 'ec-expander';
        options.theme.rowHead = 'ec-row-head';
		options.theme.slots = 'ec-slots';
		options.view = 'resourceTimelineWeek';
		options.views.resourceTimelineDay = {
			buttonText: btnTextDay,
			component: initViewComponent,
			displayEventEnd: false,
			dayHeaderFormat: {weekday: 'long'},
			duration: {days: 1},
			theme: themeView('ec-resource ec-timeline ec-day-view'),
			titleFormat: {year: 'numeric', month: 'long', day: 'numeric'}
		};
		options.views.resourceTimelineWeek = {
			buttonText: btnTextWeek,
			component: initViewComponent,
			displayEventEnd: false,
			duration: {weeks: 1},
			theme: themeView('ec-resource ec-timeline ec-week-view')
		};
		options.views.resourceTimelineMonth = {
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
		};
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
