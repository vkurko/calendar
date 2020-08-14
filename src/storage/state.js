import {writable} from 'svelte/store';
import {is_function, tick} from 'svelte/internal';
import {createOptions, createMutators} from './options';
import {writable2, currentRange, activeRange, events, intl, intlRange, viewTitle, viewDates, view} from './stores';
import {assign} from '../utils';

export default class {
    constructor(input) {
        let plugins = input.plugins || [];

        // Create options
        let options = createOptions(input, plugins);
        let mutators = createMutators(options, plugins);

        // Create stores for options
        for (let [option, value] of Object.entries(options)) {
            this[option] = writable2(value, mutators[option]);
        }

        // Private stores
        this._currentRange = currentRange(this);
        this._activeRange = activeRange(this);
        this._fetchedRange = writable({start: undefined, end: undefined});
        this._events = events(this);
        this._intlEventTime = intl(this.locale, this.eventTimeFormat);
        this._intlSlotLabel = intl(this.locale, this.slotLabelFormat);
        this._intlDayHeader = intl(this.locale, this.dayHeaderFormat);
        this._titleIntlRange = intlRange(this.locale, this.titleFormat);
        this._scrollable = writable(false);
        this._viewTitle = viewTitle(this);
        this._viewDates = viewDates(this);
        this._view = view(this);
        this._viewComponent = writable(undefined);

        // Let plugins create their private stores
        for (let plugin of plugins) {
            if ('createStores' in plugin) {
                plugin.createStores(this);
            }
        }

        // Set options for each view
        let views = new Set([...Object.keys(options.views), ...Object.keys(input.views || {})]);
        for (let view of views) {
            let opts = assign({}, options, options.views[view] || {}, input, input.views && input.views[view] || {});
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