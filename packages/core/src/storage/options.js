import {
    createDate, createDuration, createEvents, createEventSources, createResources, createDateRange, keys, setMidnight
} from '#lib';

export function createOptions(plugins) {
    let options = {
        allDayContent: undefined,
        allDaySlot: true,
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
        filterResourcesWithEvents: false,
        firstDay: 0,
        flexibleSlotTimeLimits: false,  // ec option
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
        nowIndicator: false,
        resourceLabelContent: undefined,
        resourceLabelDidMount: undefined,
        resources: [],
        selectable: false,
        scrollTime: '06:00:00',
        slotDuration: '00:30:00',
        slotEventOverlap: true,
        slotHeight: 24,  // ec option
        slotLabelInterval: undefined,
        slotLabelFormat: {
            hour: 'numeric',
            minute: '2-digit'
        },
        slotMaxTime: '24:00:00',
        slotMinTime: '00:00:00',
        slotWidth: 72,
        theme: {
            allDay: 'ec-all-day',
            active: 'ec-active',
            bgEvent: 'ec-bg-event',
            bgEvents: 'ec-bg-events',
            body: 'ec-body',
            button: 'ec-button',
            buttonGroup: 'ec-button-group',
            calendar: 'ec',
            content: 'ec-content',
            day: 'ec-day',
            dayHead: 'ec-day-head',
            days: 'ec-days',
            disabled: 'ec-disabled',
            event: 'ec-event',
            eventBody: 'ec-event-body',
            eventTime: 'ec-event-time',
            eventTitle: 'ec-event-title',
            events: 'ec-events',
            extra: 'ec-extra',
            handle: 'ec-handle',
            header: 'ec-header',
            hiddenScroll: 'ec-hidden-scroll',
            highlight: 'ec-highlight',
            icon: 'ec-icon',
            line: 'ec-line',
            lines: 'ec-lines',
            minor: 'ec-minor',
            nowIndicator: 'ec-now-indicator',
            otherMonth: 'ec-other-month',
            resource: 'ec-resource',
            sidebar: 'ec-sidebar',
            sidebarTitle: 'ec-sidebar-title',
            today: 'ec-today',
            time: 'ec-time',
            title: 'ec-title',
            toolbar: 'ec-toolbar',
            view: '',
            weekdays: ['ec-sun', 'ec-mon', 'ec-tue', 'ec-wed', 'ec-thu', 'ec-fri', 'ec-sat'],
            withScroll: 'ec-with-scroll'
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
        scrollTime: createDuration,
        slotDuration: createDuration,
        slotLabelInterval: input => input !== undefined ? createDuration(input) : undefined,
        slotMaxTime: createDuration,
        slotMinTime: createDuration,
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
