import {assign, createDate, createDuration, setMidnight} from '@event-calendar/common';
import {createEvents, createEventSources} from '@event-calendar/common';
import {is_function} from 'svelte/internal';

export function createOptions(plugins) {
    let options = {
        buttonText: {
            today: 'today',
        },
        date: new Date(),
        dateClick: undefined,
        datesSet: undefined,
        dayHeaderFormat: {
            weekday: 'short',
            month: 'numeric',
            day: 'numeric'
        },
        displayEventEnd: true,
        duration: {weeks: 1},
        events: [],
        eventBackgroundColor: undefined,
        eventClick: undefined,
        eventColor: undefined,
        eventContent: undefined,
        eventDidMount: undefined,
        eventMouseEnter: undefined,
        eventMouseLeave: undefined,
        eventSources: [],
        eventTimeFormat: {
            hour: 'numeric',
            minute: '2-digit'
        },
        firstDay: 0,
        flexibleSlotTimeLimits: false,  // ec option
        headerToolbar: {
            start: 'title',
            center: '',
            end: 'today prev,next'
        },
        height: 'auto',
        hiddenDays: [],
        highlightedDates: [],  // ec option
        lazyFetching: true,
        loading: undefined,
        locale: undefined,
        monthMode: false,
        scrollTime: '06:00:00',
        slotDuration: '00:30:00',
        slotHeight: 24,  // ec option
        slotLabelFormat: {
            hour: 'numeric',
            minute: '2-digit'
        },
        slotMaxTime: '24:00:00',
        slotMinTime: '00:00:00',
        theme: {
            calendar: 'ec',
            header: 'ec-header',
            withScroll: 'ec-with-scroll',
            hiddenScroll: 'ec-hidden-scroll',
            body: 'ec-body',
            week: 'ec-week',
            compact: 'ec-compact',
            toolbar: 'ec-toolbar',
            sidebar: 'ec-sidebar',
            content: 'ec-content',
            lines: 'ec-lines',
            line: 'ec-line',
            days: 'ec-days',
            day: 'ec-day',
            dayHead: 'ec-day-head',
            today: 'ec-today',
            otherMonth: 'ec-other-month',
            highlight: 'ec-highlight',
            events: 'ec-events',
            event: 'ec-event',
            eventTime: 'ec-event-time',
            eventTitle: 'ec-event-title',
            bgEvents: 'ec-bg-events',
            bgEvent: 'ec-bg-event',
            hiddenTimes: 'ec-hidden-times',
            time: 'ec-time',
            button: 'ec-button',
            buttonGroup: 'ec-button-group',
            icon: 'ec-icon',
            active: 'ec-active',
            title: 'ec-title'
        },
        titleFormat: {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        },
        view: undefined,
        viewDidMount: undefined,
        views: {}
    };

    for (let plugin of plugins) {
        if ('createOptions' in plugin) {
            plugin.createOptions(options);
        }
    }

    return options;
}

export function createParsers(options, plugins) {
    let parsers = {
        buttonText: input => is_function(input) ? input(options.buttonText) : input,
        date: date => setMidnight(createDate(date)),
        duration: createDuration,
        events: createEvents,
        eventSources: createEventSources,
        hiddenDays: days => [...new Set(days)],
        highlightedDates: dates => dates.map(createDate),
        scrollTime: createDuration,
        slotDuration: createDuration,
        slotMaxTime: createDuration,
        slotMinTime: createDuration,
        theme: input => is_function(input) ? input(options.theme) : input
    };

    for (let plugin of plugins) {
        if ('createParsers' in plugin) {
            plugin.createParsers(parsers, options);
        }
    }

    return parsers;
}

let prev;
export function diff(options) {
    let diff = [];
    if (prev) {
        for (let name of Object.keys(options)) {
            if (options[name] !== prev[name]) {
                diff.push([name, options[name]]);
            }
        }
    }
    prev = assign({}, options);

    return diff;
}
