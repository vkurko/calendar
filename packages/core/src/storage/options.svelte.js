import {untrack} from 'svelte';
import {
    createDate, createDateRange, createDuration, createEvents, createEventSources, createResources, entries,
    isFunction, keys, setMidnight
} from '#lib';
import {SvelteMap} from "svelte/reactivity";

function createOptions(plugins) {
    let options = {
        buttonText: {
            today: 'today',
        },
        customButtons: {},
        date: new Date(),
        datesSet: undefined,
        dayHeaderFormat: {
            weekday: 'short',
            month: 'numeric',
            day: 'numeric'
        },
        dayHeaderAriaLabelFormat: {
            dateStyle: 'full'
        },
        displayEventEnd: true,
        duration: {weeks: 1},
        events: [],
        eventAllUpdated: undefined,
        eventBackgroundColor: undefined,
        eventClassNames: undefined,
        eventClick: undefined,
        eventColor: undefined,
        eventContent: undefined,
        eventDidMount: undefined,
        eventFilter: undefined,    // ec option
        eventMouseEnter: undefined,
        eventMouseLeave: undefined,
        eventOrder: undefined,
        eventSources: [],
        eventTextColor: undefined,
        eventTimeFormat: {
            hour: 'numeric',
            minute: '2-digit'
        },
        filterEventsWithResources: false,
        firstDay: 0,
        headerToolbar: {
            start: 'title',
            center: '',
            end: 'today prev,next'
        },
        height: undefined,
        hiddenDays: [],
        highlightedDates: [],  // ec option
        lazyFetching: true,
        loading: undefined,
        locale: undefined,
        resources: [],
        selectable: false,
        theme: {
            active: 'ec-active',
            bgEvent: 'ec-bg-event',
            bgEvents: 'ec-bg-events',
            body: 'ec-body',
            button: 'ec-button',
            buttonGroup: 'ec-button-group',
            calendar: 'ec',
            colHead: 'ec-col-head',
            day: 'ec-day',
            dayHead: 'ec-day-head',
            disabled: 'ec-disabled',
            event: 'ec-event',
            eventBody: 'ec-event-body',
            eventTime: 'ec-event-time',
            eventTitle: 'ec-event-title',
            events: 'ec-events',
            grid: 'ec-grid',
            header: 'ec-header',
            hidden: 'ec-hidden',
            highlight: 'ec-highlight',
            icon: 'ec-icon',
            main: 'ec-main',
            noBeb: 'ec-no-beb',  // no block end border
            noIeb: 'ec-no-ieb',  // no inline end border
            today: 'ec-today',
            title: 'ec-title',
            toolbar: 'ec-toolbar',
            view: '',
            weekdays: ['ec-sun', 'ec-mon', 'ec-tue', 'ec-wed', 'ec-thu', 'ec-fri', 'ec-sat'],
        },
        titleFormat: {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        },
        validRange: undefined,
        view: undefined,
        viewDidMount: undefined,
        views: {}
    };

    // Let plugins add their options
    for (let plugin of plugins) {
        plugin.createOptions?.(options);
    }

    return options;
}

function createParsers(plugins) {
    let parsers = {
        date: date => setMidnight(createDate(date)),
        duration: createDuration,
        events: createEvents,
        eventSources: createEventSources,
        hiddenDays: days => [...new Set(days)],
        highlightedDates: dates => dates.map(date => setMidnight(createDate(date))),
        resources: createResources,
        validRange: createDateRange
    };

    // Let plugins add their parsers
    for (let plugin of plugins) {
        plugin.createParsers?.(parsers);
    }

    return parsers;
}

// Options where default value is passed to the function
const specialOptions = ['buttonText', 'customButtons', 'theme'];

export function optionsState(mainState, plugins, userOptions) {
    // Create default options and parsers
    let defOptions = createOptions(plugins);
    let parsers = createParsers(plugins);

    // Parse options
    defOptions = parseOptions(defOptions, parsers);
    userOptions = parseOptions(userOptions, parsers);

    // Extract view-specific options
    let defViewOptions = extractOption(defOptions, 'views') ?? {};
    let userViewOptions = extractOption(userOptions, 'views') ?? {};

    // Create options state
    let options = new SvelteMap();
    setOptions(options, defOptions);

    let setters = {};
    let currentOpts = {};

    function initEffects() {
        // Set initial view based on input
        if (userOptions.view) {
            options.set('view', userOptions.view);
        }
        // Set options for each view
        let views = new Set([...keys(defViewOptions), ...keys(userViewOptions)]);
        for (let view of views) {
            let defOpts = mergeOpts(defOptions, defViewOptions[view] ?? {});
            let opts = mergeOpts(defOpts, userOptions, userViewOptions[view] ?? {});
            let component = extractOption(opts, 'component');
            // View has been set
            delete opts.view;
            // Set up option setters and delete unknown options
            for (let key of keys(opts)) {
                if (options.has(key)) {
                    if (!setters[key]) {
                        setters[key] = [];
                    }
                    setters[key].push(
                        specialOptions.includes(key)
                            ? value => opts[key] = isFunction(value) ? value(defOpts[key]) : value
                            : value => opts[key] = value
                    );
                } else {
                    delete opts[key];
                }
            }
            // When view changes...
            $effect.pre(() => {
                let newView = options.get('view');
                untrack(() => {
                    if (newView === view) {
                        // ...switch view component
                        mainState.setViewComponent(component);
                        // ...and update options
                        currentOpts = opts;
                        setOptions(options, opts);
                    }
                });
            });
        }
    }

    return {
        proxy: new Proxy(options, {
            set(options, key, value) {
                currentOpts[key] = value;
                options.set(key, value);
                return true;
            },
            get(options, key) {
                return options.get(key);
            }
        }),
        setOption(key, value, parsed) {
            if (options.has(key)) {
                if (!parsed && key in parsers) {
                    value = parsers[key](value);
                }
                // Set value for all views
                setters[key]?.forEach(set => set(value));
                options.set(key, currentOpts[key] ?? value);
            }
        },
        initEffects
    };
}

function parseOptions(opts, parsers) {
    let result = {...opts};
    for (let key of keys(parsers)) {
        if (key in result) {
            result[key] = parsers[key](result[key]);
        }
    }
    if (opts.views) {
        result.views = {};
        for (let view of keys(opts.views)) {
            result.views[view] = parseOptions(opts.views[view], parsers);
        }
    }
    return result;
}

function extractOption(options, name) {
    let extracted = options[name];
    delete options[name];
    return extracted;
}

function mergeOpts(...args) {
    let result = {};
    for (let opts of args) {
        let override = {};
        for (let key of specialOptions) {
            if (isFunction(opts[key])) {
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

function setOptions(map, options) {
    for (let [key, value] of entries(options)) {
        map.set(key, value);
    }
}

export function diff(options, prevOptions) {
    let diff = [];
    for (let key of keys(options)) {
        if (options[key] !== prevOptions[key]) {
            diff.push([key, options[key]]);
        }
    }
    return diff;
}
