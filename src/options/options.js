import {writable} from 'svelte/store';
import {createOptions} from './defaults';
import * as stores from './stores';
import {createDate, createDuration, assign} from '../utils';

export default class {
    constructor(input) {
        let plugins = input.plugins || [];

        // Create default options
        let options = createOptions(plugins);

        // Create stores for options
        this.date = stores.date(createDate(options.date));
        this.events = stores.events(options.events);
        this.eventContent = writable(options.eventContent);
        this.eventClick = writable(options.eventClick);
        this.dayHeaderFormat = writable(options.dayHeaderFormat);
        this.locale = writable(options.locale);
        this.timeFormat = writable(options.timeFormat);
        this.view = writable(options.view);
        this.duration = stores.duration(createDuration(options.duration));
        this.theme = writable(options.theme);
        // Internal options
        this._viewComponent = writable(undefined);
        this._viewDates = stores.viewDates(this.date, this.duration);
        this._intlDayHeader = stores.intl(this.locale, this.dayHeaderFormat);
        this._intlTime = stores.intl(this.locale, this.timeFormat);
        // Let plugins create stores for their options
        for (let plugin of plugins) {
            plugin.createStoresForOptions(this, options);
        }

        // Set options for each view
        let views = new Set([...Object.keys(options.views), ...Object.keys(input.views || {})]);
        for (let view of views) {
            let opts = assign({}, options, options.views[view] || {}, input, input.views && input.views[view] || {});
            // Change view component when view changes
            this.view.subscribe(newView => {
                if (newView === view) {
                    this._viewComponent.set(opts.component);
                }
            });
            for (let key of Object.keys(opts)) {
                if (this.hasOwnProperty(key) && key[0] !== '_') {
                    let {subscribe, set, _set, update} = this[key];

                    this[key] = {
                        subscribe,
                        set: value => {opts[key] = value; return set(value);},  // set value for all views
                        _set: _set || set,  // original 'set'
                        update
                    };

                    // Change value when view changes
                    this.view.subscribe(newView => {
                        if (newView === view) {
                            this[key]._set(opts[key]);
                        }
                    });
                }
            }
        }
    }
}