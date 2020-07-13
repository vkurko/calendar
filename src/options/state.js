import {writable} from 'svelte/store';
import {is_function, tick} from 'svelte/internal';
import {createInitOptions} from './init';
import * as stores from './stores';
import {createDate, createDuration, setHours} from '../lib/date';
import {createEvents, createEventSources} from '../lib/events';
import {assign} from '../utils';

export default class {
    constructor(input) {
        let plugins = input.plugins || [];

        // Create init options
        let init = createInitOptions(plugins);

        // Create stores for options
        this.date = stores.writable2(init.date, date => setHours(createDate(date), 0, 0, 0, 0));
        this.duration = stores.writable2(init.duration, createDuration);
        this.events = stores.writable2(init.events, createEvents);
        this.eventSources = stores.writable2(init.eventSources, createEventSources);
        this.eventColor = writable(init.eventColor);
        this.eventBackgroundColor = writable(init.eventBackgroundColor);
        this.eventTimeFormat = writable(init.eventTimeFormat);
        this.eventContent = writable(init.eventContent);
        this.eventClick = writable(init.eventClick);
        this.dateClick = writable(init.dateClick);
        this.slotDuration = stores.writable2(init.slotDuration, createDuration);
        this.slotLabelFormat = writable(init.slotLabelFormat);
        this.scrollTime = stores.writable2(init.scrollTime, createDuration);
        this.dayHeaderFormat = writable(init.dayHeaderFormat);
        this.firstDay = writable(init.firstDay);
        this.highlightDate = writable(init.highlightDate);
        this.locale = writable(init.locale);
        this.headerToolbar = writable(init.headerToolbar);
        this.titleFormat = writable(init.titleFormat);
        this.buttonText = writable(init.buttonText);
        this.height = writable(init.height);
        this.lazyFetching = writable(init.lazyFetching);
        this.loading = writable(init.loading);
        this.viewDidMount = writable(init.viewDidMount);
        this.view = writable(input.view || init.view);  // set initial view based on input
        this.theme = stores.writable2(init.theme, input => is_function(input) ? input(init.theme) : input);

        // Internal options
        this._viewDates = stores.viewDates(this.date, this.duration, this.firstDay);
        this._view = stores.view(this.view, this._viewDates);
        this._fetchedRange = writable({start: undefined, end: undefined});
        this._events = stores.events(this.events, this.eventSources, this._viewDates, this._fetchedRange, this.lazyFetching, this.loading);
        this._intlEventTime = stores.intl(this.locale, this.eventTimeFormat);
        this._intlSlotLabel = stores.intl(this.locale, this.slotLabelFormat);
        this._intlDayHeader = stores.intl(this.locale, this.dayHeaderFormat);
        this._titleIntlRange = stores.intlRange(this.locale, this.titleFormat);
        this._viewComponent = writable(undefined);

        // Let plugins create stores for their options
        for (let plugin of plugins) {
            plugin.createStoresForOptions(this, init);
        }

        // Set options for each view
        let views = new Set([...Object.keys(init.views), ...Object.keys(input.views || {})]);
        for (let view of views) {
            let opts = assign({}, init, init.views[view] || {}, input, input.views && input.views[view] || {});
            // Change view component when view changes
            this.view.subscribe(newView => {
                if (newView === view) {
                    this._viewComponent.set(opts.component);
                    if (is_function(opts.viewDidMount)) {
                        tick().then(() => opts.viewDidMount(this._view.get()));
                    }
                }
            });
            for (let key of Object.keys(opts)) {
                if (this.hasOwnProperty(key) && key[0] !== '_') {
                    let {set, _set, mutate, ...rest} = this[key];

                    if (!_set) {
                        // Original set
                        _set = set;
                    }

                    if (mutate) {
                        opts[key] = mutate(opts[key]);
                    }

                    this[key] = {
                        // Set value in all views
                        set: value => {opts[key] = value; set(value);},
                        _set,
                        mutate,
                        ...rest
                    };

                    // Change value when view changes
                    this.view.subscribe(newView => {
                        if (newView === view) {
                            _set(opts[key]);
                        }
                    });
                }
            }
        }
    }
}