import {
    createDate, createDuration, createEvents, createEventSources, createResources, createDateRange, keys, setMidnight
} from '#lib';

// Options where initial value is passed to the function
export const specialOptions = ['buttonText', 'customButtons', 'theme'];

export function createOptions(plugins) {
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
            allDay: 'ec-all-day',
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

    for (let plugin of plugins) {
        plugin.createOptions?.(options);
    }

    return options;
}

export function createParsers(plugins) {
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

    for (let plugin of plugins) {
        plugin.createParsers?.(parsers);
    }

    return parsers;
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
