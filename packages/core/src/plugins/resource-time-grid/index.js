import {assign, btnTextDay, btnTextWeek, themeView} from '#lib';
import {setExtensions} from '../time-grid/lib.js';
import {createTROptions, createTRROptions, createTRRParsers} from '../time-grid/options.js';
import {createRROptions} from './options.js';
import View from './View.svelte';

export default {
    createOptions(options) {
        createTROptions(options);
        createTRROptions(options);
        createRROptions(options);
        assign(options, {
            datesAboveResources: false,
            // Common options
            view: 'resourceTimeGridWeek'
        });
        assign(options.buttonText, {
            resourceTimeGridDay: 'resources',
            resourceTimeGridWeek: 'resources'
        });
        assign(options.theme, {
            colGroup: 'ec-col-group'
        });
        assign(options.views, {
            resourceTimeGridDay: {
                buttonText: btnTextDay,
                component: initViewComponent,
                dayHeaderFormat: {weekday: 'long'},
                duration: {days: 1},
                theme: themeView('ec-resource ec-time-grid ec-day-view')
            },
            resourceTimeGridWeek: {
                buttonText: btnTextWeek,
                component: initViewComponent,
                duration: {weeks: 1},
                theme: themeView('ec-resource ec-time-grid ec-week-view')
            }
        });
    },

    createParsers(parsers) {
        createTRRParsers(parsers);
    }
}

function initViewComponent(mainState) {
    setExtensions(mainState);
    return View;
}
