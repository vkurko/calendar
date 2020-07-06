import {writable} from 'svelte/store';
import {createDate, createDuration, assign} from './utils';

const defaults = {
    date: new Date(),
    events: [],
    eventContent: undefined,
    eventClick: undefined,
    slotDuration: {hours: 1},
    dayHeaderFormat: {
        weekday: 'short',
        month: 'numeric',
        day: 'numeric',
        omitCommas: true
    },
    timeFormat: {
        hour: '2-digit',
        minute: '2-digit'
    },
    view: 'timeGridWeek',
    views: {},
    duration: {weeks: 1},
    theme: {
        calendar: 'calendar',
        header: 'header',
        body: 'body',
        toolbar: 'toolbar',
        sidebar: 'sidebar',
        content: 'content',
        lines: 'lines',
        line: 'line',
        day: 'day',
        events: 'events',
        event: 'event',
        eventTitle: 'event-title',
        bgEvents: 'bg-events',
        bgEvent: 'bg-event',
        time: 'time',
        flex: 'flex'
    }
};

const views = {
    timeGridDay: {duration: {days: 1}},
    timeGridWeek: {duration: {weeks: 1}}
};

export default class {
    constructor(options) {
        this.date = dateStore(defaults.date);
        this.events = eventsStore(defaults.events);
        this.eventContent = writable(defaults.eventContent);
        this.eventClick = writable(defaults.eventClick);
        this.slotDuration = durationStore(createDuration(defaults.slotDuration));
        this.dayHeaderFormat = writable(defaults.dayHeaderFormat);
        this.timeFormat = writable(defaults.timeFormat);
        this.view = writable(defaults.view);
        this.duration = durationStore(createDuration(defaults.duration));
        this.theme = writable(defaults.theme);

        // Apply options
        for (let [view, viewDefaults] of Object.entries(views)) {
            let opts = assign({}, defaults, viewDefaults, options, options.views && options.views[view] || {});
            for (let key of Object.keys(opts)) {
                if (this.hasOwnProperty(key)) {
                    let {subscribe, set, _set, update} = this[key];

                    this[key] = {
                        subscribe,
                        set: value => {opts[key] = value; return set(value);},  // set value for all views
                        _set: _set || set,  // original 'set'
                        update
                    };

                    // Change value when view changes
                    this.view.subscribe(newView => {
                        if (newView === view) {
                            this[key]._set(opts[key]);
                        }
                    });
                }
            }
        }
    }
}

function dateStore(initValue) {
    let {subscribe, set, update} = writable(initValue);

    return {
        subscribe,
        set: date => set(createDate(date)),
        update
    };
}

function durationStore(initValue) {
    let {subscribe, set, update} = writable(initValue);

    return {
        subscribe,
        set: duration => set(createDuration(duration)),
        update
    };
}

function eventsStore(initValue) {
    let {subscribe, set, update} = writable(initValue);
    let id = 0;

    return {
        subscribe,
        set: events => {
            let newEvents = [];
            for (let event of events) {
                newEvents.push({
                    id: 'id' in event ? event.id : `{generated}-${id++}`,
                    start: createDate(event.start),
                    end: createDate(event.end),
                    title: 'title' in event ? event.title : '',
                    display: 'display' in event ? event.display : 'auto'
                });
            }
            return set(newEvents);
        },
        update
    };
}