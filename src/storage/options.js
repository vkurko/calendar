import {createDate, createDuration, setMidnight} from '../lib/date';
import {createEvents, createEventSources} from '../lib/events';
import {is_function} from 'svelte/internal';

export function createOptions(input, plugins) {
    let options = {
        buttonText: {
            today: 'today',
        },
        date: new Date(),
        dateClick: undefined,
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
        height: '800px',
        highlightDate: false,  // ec option
        lazyFetching: true,
        loading: undefined,
        locale: undefined,
        monthMode: false,
        scrollTime: '06:00:00',
        slotDuration: {hours: 1},
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
            body: 'ec-body',
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
            eventContent: 'ec-event-content',
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
        view: input.view || undefined,  // set initial view based on input
        viewDidMount: undefined,
        views: {}
    };

    for (let plugin of plugins) {
        if ('createOptions' in plugin) {
            plugin.createOptions(options, input);
        }
    }

    return options;
}

export function createMutators(options, plugins) {
    let mutators = {
        date: date => setMidnight(createDate(date)),
        duration: createDuration,
        events: createEvents,
        eventSources: createEventSources,
        scrollTime: createDuration,
        slotDuration: createDuration,
        slotMaxTime: createDuration,
        slotMinTime: createDuration,
        theme: input => is_function(input) ? input(options.theme) : input
    };

    for (let plugin of plugins) {
        if ('createMutators' in plugin) {
            plugin.createMutators(mutators, options);
        }
    }

    return mutators;
}
