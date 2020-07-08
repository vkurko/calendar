import {derived, writable} from 'svelte/store';
import {cloneDate, createDate, createDuration, modifyDate} from '../utils';

export function date(initValue) {
    let {subscribe, set, update} = writable(initValue);

    return {
        subscribe,
        set: date => set(createDate(date)),
        update
    };
}

export function duration(initValue) {
    let {subscribe, set, update} = writable(initValue);

    return {
        subscribe,
        set: duration => set(createDuration(duration)),
        update
    };
}

export function events(initValue) {
    let {subscribe, set, update} = writable(initValue);
    let id = 0;

    return {
        subscribe,
        set: events => {
            let newEvents = [];
            for (let event of events) {
                newEvents.push({
                    id: 'id' in event ? event.id : `{generated}-${id++}`,
                    resourceIds: 'resourceIds' in event ? event.resourceIds : ('resourceId' in event ? [event.resourceId] : []),
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

export function viewDates(date, duration) {
    return derived([date, duration], ([$date, $duration]) => {
        let dates = [];
        let date = cloneDate($date);
        if ($duration.inWeeks) {
            // First day of week
            while (date.getDay()) {
                date.setDate(date.getDate() - 1);
            }
        }
        let end = cloneDate(date);
        modifyDate(end, $duration);
        while (date < end) {
            dates.push(cloneDate(date));
            date.setDate(date.getDate() + 1);
        }

        return dates;
    });
}

export function intl(locale, format) {
    return derived([locale, format], ([$locale, $format]) => new Intl.DateTimeFormat($locale, $format));
}