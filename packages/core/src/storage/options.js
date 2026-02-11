import {untrack} from 'svelte';
import {
    assign, createDate, createDateRange, createDuration, createEvents, createEventSources, createResources, hasOwn,
    isArray, isFunction, isPlainObject, keys, setMidnight
} from '#lib';
import {objectProxy} from './proxy.svelte.js';

function createOptions(plugins) {
    let options = {
        buttonText: {
            today: 'today',
        },
        customButtons: {},
        customScrollbars: false,  // ec option
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
        eventFilter: undefined,  // ec option
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
        refetchResourcesOnNavigate: false,
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
            customScrollbars: 'ec-custom-scrollbars',
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
        date: input => setMidnight(createDate(input)),
        duration: createDuration,
        events: createEvents,
        eventSources: createEventSources,
        hiddenDays: input => [...new Set(input)],
        highlightedDates: input => input.map(item => setMidnight(createDate(item))),
        resources: input => isArray(input) ? createResources(input) : input,
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

export function optionsState(plugins, userOptions) {
    // Create default options and parsers
    let defOptions = createOptions(plugins);
    let parsers = createParsers(plugins);

    // Parse options
    defOptions = parseOptions(defOptions, parsers);
    userOptions = parseOptions(userOptions, parsers);

    // Extract view-specific options
    let defViews = extractOption(defOptions, 'views') ?? {};
    let userViews = extractOption(userOptions, 'views') ?? {};

    // Create options state
    let options = objectProxy({});
    assign(options, defOptions);
    // Set initial view based on input
    if (userOptions.view) {
        options.view = userOptions.view;
    }

    // Set options for each view
    let setters = {};
    let viewOptions = {};
    let viewComponents = {};
    let views = new Set([...keys(defViews), ...keys(userViews)]);
    for (let view of views) {
        let userViewOptions = userViews[view] ?? {};
        let defOpts = mergeOpts(defOptions, defViews[view] ?? defViews[userViewOptions.type] ?? {});
        let opts = mergeOpts(defOpts, userOptions, userViewOptions);
        let component = extractOption(opts, 'component');
        // View has been set
        delete opts.view;
        // Set up option setters and delete unknown options
        for (let key of keys(opts)) {
            if (hasOwn(options, key)) {
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
        viewOptions[view] = opts;
        viewComponents[view] = component;
    }

    assign(options, viewOptions[options.view]);

    return [
        options,
        function setOption(key, value, parsed = true) {
            if (hasOwn(options, key)) {
                if (!parsed) {
                    if (key in parsers) {
                        value = parsers[key](value);
                    } else if (isPlainObject(value)) {
                        value = {...value};
                    } else if (isArray(value)) {
                        value = [...value];
                    }
                }
                // Set value for all views
                setters[key]?.forEach(set => set(value));
                options[key] = value;
            }
        },
        function setViewOptions(view) {
            assign(options, viewOptions[view]);
            return viewComponents[view];
        }
    ];
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

export function diff(options, prevOptions) {
    let diff = [];
    for (let key of keys(options)) {
        if (options[key] !== prevOptions[key]) {
            diff.push([key, options[key]]);
        }
    }
    return diff;
}
