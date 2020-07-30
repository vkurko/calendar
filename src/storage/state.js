import {derived, writable} from 'svelte/store';
import {is_function, tick} from 'svelte/internal';
import {createOptions} from './options';
import * as stores from './stores';
import {createDate, createDuration, setMidnight} from '../lib/date';
import {createEvents, createEventSources} from '../lib/events';
import {assign} from '../utils';

export default class {
    constructor(input) {
        let plugins = input.plugins || [];

        // Create init options
        let init = createOptions(plugins);

        // Create stores for options
        this.date = stores.writable2(init.date, date => setMidnight(createDate(date)));
        this.duration = stores.writable2(init.duration, createDuration);
        this.monthMode = writable(init.monthMode);
        this.events = stores.writable2(init.events, createEvents);
        this.eventSources = stores.writable2(init.eventSources, createEventSources);
        this.eventColor = writable(init.eventColor);
        this.eventBackgroundColor = writable(init.eventBackgroundColor);
        this.eventTimeFormat = writable(init.eventTimeFormat);
        this.eventContent = writable(init.eventContent);
        this.eventClick = writable(init.eventClick);
        this.eventDidMount = writable(init.eventDidMount);
        this.dateClick = writable(init.dateClick);
        this.slotDuration = stores.writable2(init.slotDuration, createDuration);
        this.slotLabelFormat = writable(init.slotLabelFormat);
        this.slotMinTime = stores.writable2(init.slotMinTime, createDuration);
        this.slotMaxTime = stores.writable2(init.slotMaxTime, createDuration);
        this.flexibleSlotTimeLimits = writable(init.flexibleSlotTimeLimits);
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
        this._currentRange = stores.currentRange(this.date, this.duration, this.monthMode, this.firstDay);
        this._activeRange = stores.activeRange(this._currentRange, this.monthMode, this.firstDay);
        this._fetchedRange = writable({start: undefined, end: undefined});
        this._events = stores.events(this.events, this.eventSources, this._activeRange, this._fetchedRange, this.lazyFetching, this.loading);
        this._intlEventTime = stores.intl(this.locale, this.eventTimeFormat);
        this._intlSlotLabel = stores.intl(this.locale, this.slotLabelFormat);
        this._intlDayHeader = stores.intl(this.locale, this.dayHeaderFormat);
        this._titleIntlRange = stores.intlRange(this.locale, this.titleFormat);
        this._scrollable = writable(false);
        this._viewTitle = stores.viewTitle(this.date, this._activeRange, this._titleIntlRange, this.monthMode);
        this._viewDates = stores.viewDates(this._activeRange);
        this._view = stores.view(this.view, this._viewTitle, this._currentRange, this._activeRange);
        this._viewComponent = writable(undefined);

        // Let plugins create stores for their options
        for (let plugin of plugins) {
            plugin.createStores(this, init);
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