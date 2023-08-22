import {writable} from 'svelte/store';
import {is_function, tick, noop, identity} from 'svelte/internal';
import {createOptions, createParsers} from './options';
import {
    activeRange,
    currentRange,
    dayGrid,
    events,
    now,
    today,
    viewDates,
    viewTitle,
    view as view2  // hack to avoid a runtime error in SvelteKit dev mode (ReferenceError: view is not defined)
} from './stores';
import {keys, writable2, intl, intlRange} from '../lib.js';

export default class {
    constructor(plugins, input) {
        plugins = plugins || [];

        // Create options
        let options = createOptions(plugins);
        let parsers = createParsers(plugins);

        // Parse options
        options = parseOpts(options, parsers);
        input = parseOpts(input, parsers);

        // Create stores for options
        for (let [option, value] of Object.entries(options)) {
            this[option] = writable2(value, parsers[option]);
        }

        // Private stores
        this._queue = writable(new Map());  // debounce queue
        this._auxiliary = writable([]);  // auxiliary components
        this._dayGrid = dayGrid(this);
        this._currentRange = currentRange(this);
        this._activeRange = activeRange(this);
        this._fetchedRange = writable({start: undefined, end: undefined});
        this._events = events(this);
        this._now = now();
        this._today = today(this);
        this._intlEventTime = intlRange(this.locale, this.eventTimeFormat);
        this._intlSlotLabel = intl(this.locale, this.slotLabelFormat);
        this._intlDayHeader = intl(this.locale, this.dayHeaderFormat);
        this._intlTitle = intlRange(this.locale, this.titleFormat);
        this._bodyEl = writable(undefined);
        this._scrollable = writable(false);
        this._viewTitle = viewTitle(this);
        this._viewDates = viewDates(this);
        this._view = view2(this);
        this._viewComponent = writable(undefined);
        // Resources
        this._resBgColor = writable(noop);
        this._resTxtColor = writable(noop);
        // Interaction
        this._interaction = writable({});
        this._iEvents = writable([null, null]);  // interaction events: [drag/resize, pointer]
        this._iClasses = writable(identity);  // interaction event css classes
        this._iClass = writable(undefined);  // interaction css class for entire calendar

        // Let plugins create their private stores
        for (let plugin of plugins) {
            plugin.createStores?.(this);
        }

        if (input.view) {
            // Set initial view based on input
            this.view.set(input.view);
        }

        // Set options for each view
        let views = new Set([...keys(options.views), ...keys(input.views ?? {})]);
        for (let view of views) {
            let opts = mergeOpts(options, options.views[view] ?? {}, input, input.views?.[view] ?? {});
            // Change view component when view changes
            this.view.subscribe(newView => {
                if (newView === view) {
                    this._viewComponent.set(opts.component);
                    if (is_function(opts.viewDidMount)) {
                        tick().then(() => opts.viewDidMount(this._view.get()));
                    }
                }
            });
            // Process options
            for (let key of keys(opts)) {
                if (this.hasOwnProperty(key) && key[0] !== '_') {
                    let {set, _set, ...rest} = this[key];

                    if (!_set) {
                        // Original set
                        _set = set;
                    }

                    this[key] = {
                        // Set value in all views
                        set: value => {opts[key] = value; set(value);},
                        _set,
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

function parseOpts(opts, parsers) {
    let result = {};
    for (let key of keys(opts)) {
        result[key] = parsers[key] ? parsers[key](opts[key]) : opts[key];
    }
    if (opts.views) {
        for (let view of keys(opts.views)) {
            result.views[view] = parseOpts(opts.views[view], parsers);
        }
    }
    return result;
}

function mergeOpts(...args) {
    let mergable = ['buttonText', 'theme'];
    let result = {};
    for (let opts of args) {
        for (let key of keys(opts)) {
            result[key] = mergable.includes(key) && is_function(opts[key]) ? opts[key](result[key]) : opts[key];
        }
    }
    return result;
}
