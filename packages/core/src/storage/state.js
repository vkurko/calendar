import {writable} from 'svelte/store';
import {is_function, tick, noop, identity} from 'svelte/internal';
import {createOptions, createParsers} from './options';
import {
    activeRange,
    currentRange,
    events,
    monthMode,
    now,
    today,
    viewDates,
    viewTitle,
    view as view2  // hack to avoid a runtime error in SvelteKit dev mode (ReferenceError: view is not defined)
} from './stores';
import {writable2, intl, intlRange} from '@event-calendar/common';
import {assign} from '@event-calendar/common';

export default class {
    constructor(plugins, input) {
        plugins = plugins || [];

        // Create options
        let options = createOptions(plugins);
        let parsers = createParsers(options, plugins);

        // Create stores for options
        for (let [option, value] of Object.entries(options)) {
            this[option] = writable2(value, parsers[option]);
        }

        // Private stores
        this._queue = writable(new Map());  // debounce queue
        this._auxiliary = writable([]);  // auxiliary components
        this._viewClass = writable(undefined);
        this._monthMode = monthMode(this);
        this._currentRange = currentRange(this);
        this._activeRange = activeRange(this);
        this._fetchedRange = writable({start: undefined, end: undefined});
        this._events = events(this);
        this._now = now();
        this._today = today(this);
        this._intlEventTime = intl(this.locale, this.eventTimeFormat);
        this._intlSlotLabel = intl(this.locale, this.slotLabelFormat);
        this._intlDayHeader = intl(this.locale, this.dayHeaderFormat);
        this._titleIntlRange = intlRange(this.locale, this.titleFormat);
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
        this._draggable = writable(noop);
        this._resizable = writable(noop);
        this._classes = writable(identity);
        this._iClass = writable(undefined);

        // Let plugins create their private stores
        for (let plugin of plugins) {
            if ('createStores' in plugin) {
                plugin.createStores(this);
            }
        }

        if (input.view) {
            // Set initial view based on input
            this.view.set(input.view);
        }

        // Set options for each view
        let commonOpts = assign({}, options, input);
        parseOpts(commonOpts, this);
        let views = new Set([...Object.keys(options.views), ...Object.keys(input.views || {})]);
        for (let view of views) {
            let viewOpts = assign({}, options.views[view] || {}, input.views && input.views[view] || {});
            parseOpts(viewOpts, this);
            let opts = assign({}, commonOpts, viewOpts);
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
            for (let key of Object.keys(opts)) {
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

function parseOpts(opts, state) {
    for (let key of Object.keys(opts)) {
        if (state.hasOwnProperty(key) && key[0] !== '_') {
            if (state[key].parse) {
                opts[key] = state[key].parse(opts[key]);
            }
        }
    }
}
