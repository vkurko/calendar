import {createDate} from './date';

let eventId = 1;
export function createEvents(input) {
    return input.map(event => ({
        id: 'id' in event ? String(event.id) : `{generated-${eventId++}}`,
        resourceIds: Array.isArray(event.resourceIds)
            ? event.resourceIds.map(String)
            : ('resourceId' in event ? [String(event.resourceId)] : []),
        start: createDate(event.start),
        end: createDate(event.end),
        title: event.title || '',
        display: event.display || 'auto',
        extendedProps: event.extendedProps || {},
        backgroundColor: event.backgroundColor || event.color
    }));
}

let absURL = new RegExp('^(?:[a-z]+:)?//', 'i');
let fakeBase = 'http://a';
export function createEventSources(input) {
    return input.map(source => ({
        url: new URL(source.url, fakeBase),  // for relative URLs we need to provide something as a base,
        urlFrom: absURL.test(source.url) ? 0 : fakeBase.length,
        extraParams: source.extraParams || {}
    }));
}

export function createEventChunk(event, start, end) {
    return {
        start: event.start > start ? event.start : start,
        end: event.end < end ? event.end : end,
        event
    };
}

export function sortEventChunks(chunks) {
    // Sort by start date
    chunks.sort((a, b) => {
        if (a.start < b.start) {
            return -1;
        }
        if (a.start > b.start) {
            return 1;
        }
        return 0;
    });
}