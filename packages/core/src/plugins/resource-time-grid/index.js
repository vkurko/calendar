import {btnTextDay, btnTextWeek, themeView} from '#lib';
import {createTROptions, createTRROptions, createTRRParsers} from '../time-grid/options.js';
import {createTRRStores, createTRStores} from '../time-grid/stores.js';
import {createRROptions} from './options.js';
import {createRRStores} from './stores.js';
import View from './View.svelte';

export default {
    createOptions(options) {
        createTROptions(options);
        createTRROptions(options);
        createRROptions(options);
        options.datesAboveResources = false;
        // Common options
        options.buttonText.resourceTimeGridDay = 'resources';
        options.buttonText.resourceTimeGridWeek = 'resources';
        options.theme.colGroup = 'ec-col-group';
        options.view = 'resourceTimeGridWeek';
        options.views.resourceTimeGridDay = {
            buttonText: btnTextDay,
            component: View,
            dayHeaderFormat: {weekday: 'long'},
            duration: {days: 1},
            theme: themeView('ec-resource ec-time-grid ec-day-view')
        };
        options.views.resourceTimeGridWeek = {
            buttonText: btnTextWeek,
            component: View,
            duration: {weeks: 1},
            theme: themeView('ec-resource ec-time-grid ec-week-view')
        };
    },

    createParsers(parsers) {
        createTRRParsers(parsers);
    },

    createStores(state) {
        createTRRStores(state);
        createTRStores(state);
        createRRStores(state);
    }
}
