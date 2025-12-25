import {assign, btnTextDay, btnTextWeek, themeView} from '#lib';
import {setExtensions} from './lib.js';
import {createTROptions, createTRROptions, createTRRParsers} from './options.js';
import View from './View.svelte';

export default {
    createOptions(options) {
        createTRROptions(options);
        createTROptions(options);
        // Common options
        assign(options.buttonText, {
            timeGridDay:  'day',
            timeGridWeek: 'week'
        });
        assign(options, {
            view: 'timeGridWeek'
        });
        assign(options.views, {
            timeGridDay: {
                buttonText: btnTextDay,
                component: initViewComponent,
                dayHeaderFormat: {weekday: 'long'},
                duration: {days: 1},
                theme: themeView('ec-time-grid ec-day-view'),
                titleFormat: {year: 'numeric', month: 'long', day: 'numeric'}
            },
            timeGridWeek: {
                buttonText: btnTextWeek,
                component: initViewComponent,
                duration: {weeks: 1},
                theme: themeView('ec-time-grid ec-week-view')
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
