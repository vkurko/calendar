import {btnTextDay, btnTextWeek, themeView} from '#lib';
import {createTROptions, createTRROptions, createTRRParsers} from './options.js';
import {createTRRStores, createTRStores} from './stores.js';
import View from './View.svelte';

export default {
    createOptions(options) {
        createTROptions(options);
        createTRROptions(options);
        // Common options
        options.buttonText.timeGridDay = 'day';
        options.buttonText.timeGridWeek = 'week';
        options.view = 'timeGridWeek';
        options.views.timeGridDay = {
            buttonText: btnTextDay,
            component: View,
            dayHeaderFormat: {weekday: 'long'},
            duration: {days: 1},
            theme: themeView('ec-time-grid ec-day-view'),
            titleFormat: {year: 'numeric', month: 'long', day: 'numeric'}
        };
        options.views.timeGridWeek = {
            buttonText: btnTextWeek,
            component: View,
            duration: {weeks: 1},
            theme: themeView('ec-time-grid ec-week-view')
        };
    },

    createParsers(parsers) {
        createTRRParsers(parsers);
    },

    createStores(state) {
        createTRRStores(state);
        createTRStores(state);
    }
}
