import {writable} from 'svelte/store';
import {createDate} from './utils';

function dateStore(initValue) {
    let {subscribe, set, update} = writable(initValue);

    return {
        subscribe,
        set: date => set(createDate(date)),
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
                    id: id in event ? event.id : `{generated}-${id++}`,
                    start: createDate(event.start),
                    end: createDate(event.end)
                });
            }
            return set(newEvents);
        },
        update
    };
}

function slotDurationStore(initValue) {
    let {subscribe, set, update} = writable(initValue);

    return {
        subscribe,
        set: slotDuration => {
            let newSlotDuration = {
                hours: slotDuration.hours || 0,
                minutes: slotDuration.minutes || 0
            };
            if (!newSlotDuration.hours && !newSlotDuration.minutes) {
                newSlotDuration.hours = 1;
            }
            return set(newSlotDuration);
        },
        update
    };
}

export default class {
    constructor(options) {
        this.date = dateStore(new Date());
        this.events = eventsStore([]);
        this.slotDuration = slotDurationStore({
            hours: 1,
            minutes: 0
        });
        this.dayHeaderFormat = writable({
            weekday: 'short',
            month: 'numeric',
            day: 'numeric',
            omitCommas: true
        });
        this.timeFormat = writable({
            hour: '2-digit',
            minute: '2-digit'
        });
        this.theme = writable({
            calendar: 'calendar',
            header: 'header',
            body: 'body',
            sidebar: 'sidebar',
            content: 'content',
            lines: 'lines',
            line: 'line',
            day: 'day',
            events: 'events',
            event: 'event',
            time: 'time',
            flex: 'flex'
        });

        for (let key of Object.getOwnPropertyNames(this)) {
            if (key in options) {
                this[key].set(options[key]);
            }
        }
    }
}