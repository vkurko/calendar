import {get, writable} from 'svelte/store';
import {tick} from 'svelte';
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
import {keys, intl, intlRange, is_function} from '../lib.js';

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
            this[option] = writable(value);
        }

        // Private stores
        this._queue = writable(new Map());  // debounce queue (beforeUpdate)
        this._queue2 = writable(new Map());  // debounce queue (afterUpdate)
        this._tasks = new Map();  // timeout IDs for tasks
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
        this._intlDayHeaderAL = intl(this.locale, this.dayHeaderAriaLabelFormat);
        this._intlTitle = intlRange(this.locale, this.titleFormat);
        this._bodyEl = writable(undefined);
        this._scrollable = writable(false);
        this._viewTitle = viewTitle(this);
        this._viewDates = viewDates(this);
        this._view = view2(this);
        this._viewComponent = writable(undefined);
        // Interaction
        this._interaction = writable({});
        this._iEvents = writable([null, null]);  // interaction events: [drag/resize, pointer]
        this._iClasses = writable([]);  // interaction event css classes
        this._iClass = writable(undefined);  // interaction css class for entire calendar

        // Set & Get
        this._set = (key, value) => {
            if (validKey(key, this)) {
                if (parsers[key]) {
                    value = parsers[key](value);
                }
                this[key].set(value);
            }
        };
        this._get = key => validKey(key, this) ? get(this[key]) : undefined;

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
            let defOpts = mergeOpts(options, options.views[view] ?? {});
            let opts = mergeOpts(defOpts, input, input.views?.[view] ?? {});
            let component = opts.component;
            // Make sure we deal with valid opts from now on
            filterOpts(opts, this);
            // Process options
            for (let key of keys(opts)) {
                let {set, _set = set, ...rest} = this[key];

                this[key] = {
                    // Set value in all views
                    set: ['buttonText', 'theme'].includes(key)
                        ? value => {
                            if (is_function(value)) {
                                let result = value(defOpts[key]);
                                opts[key] = result;
                                set(set === _set ? result : value);
                            } else {
                                opts[key] = value;
                                set(value);
                            }
                        }
                        : value => {
                            opts[key] = value;
                            set(value);
                        },
                    _set,
                    ...rest
                };
            }
            // When view changes...
            this.view.subscribe(newView => {
                if (newView === view) {
                    // switch view component
                    this._viewComponent.set(component);
                    if (is_function(opts.viewDidMount)) {
                        tick().then(() => opts.viewDidMount(get(this._view)));
                    }
                    // update store values
                    for (let key of keys(opts)) {
                        this[key]._set(opts[key]);
                    }
                }
            });
        }
    }
}

function parseOpts(opts, parsers) {
    let result = {...opts};
    for (let key of keys(parsers)) {
        if (key in result) {
            result[key] = parsers[key](result[key]);
        }
    }
    if (opts.views) {
        result.views = {};
        for (let view of keys(opts.views)) {
            result.views[view] = parseOpts(opts.views[view], parsers);
        }
    }
    return result;
}

function mergeOpts(...args) {
    let result = {};
    for (let opts of args) {
        let override = {};
        for (let key of ['buttonText', 'theme']) {
            if (is_function(opts[key])) {
                override[key] = opts[key](result[key]);
            }
        }
        result = {
            ...result,
            ...opts,
            ...override
        };
    }
    return result;
}

function filterOpts(opts, state) {
    keys(opts)
        .filter(key => !validKey(key, state) || key == 'view')
        .forEach(key => delete opts[key]);
}

function validKey(key, state) {
    return state.hasOwnProperty(key) && key[0] !== '_';
}
