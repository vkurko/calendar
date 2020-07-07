import {writable} from 'svelte/store';
import {createDate, createDuration} from '../utils';

export function dateStore(initValue) {
    let {subscribe, set, update} = writable(initValue);

    return {
        subscribe,
        set: date => set(createDate(date)),
        update
    };
}

export function durationStore(initValue) {
    let {subscribe, set, update} = writable(initValue);

    return {
        subscribe,
        set: duration => set(createDuration(duration)),
        update
    };
}

export function eventsStore(initValue) {
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