import {createDate} from './date';

let eventId = 1;
export function createEvents(input) {
    let events = [];
    for (let event of input) {
        events.push({
            id: 'id' in event ? String(event.id) : `{generated}-${eventId++}`,
            resourceIds: Array.isArray(event.resourceIds)
                ? event.resourceIds.map(String)
                : ('resourceId' in event ? [String(event.resourceId)] : []),
            start: createDate(event.start),
            end: createDate(event.end),
            title: event.title || '',
            display: event.display || 'auto',
            extendedProps: event.extendedProps || {},
            backgroundColor: event.backgroundColor || event.color
        });
    }
    return events;
}

let absURL = new RegExp('^(?:[a-z]+:)?//', 'i');
let fakeBase = 'http://a';
export function createEventSources(input) {
    let sources = [];
    for (let source of input) {
        sources.push({
            url: new URL(source.url, fakeBase),  // for relative URLs we need to provide something as a base,
            urlFrom: absURL.test(source.url) ? 0 : fakeBase.length,
            extraParams: source.extraParams || {}
        });
    }
    return sources;
}

export function createEventChunk(event, start, end) {
    return {
        start: event.start > start ? event.start : start,
        end: event.end < end ? event.end : end,
        event
    };
}

export function groupEventChunks(chunks) {
    if (!chunks.length) {
        return;
    }

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

    // Group
    let group = {
        columns: [],
        end: chunks[0].end
    };
    for (let chunk of chunks) {
        let c = 0;
        if (chunk.start < group.end) {
            for (; c < group.columns.length; ++c) {
                if (group.columns[c][group.columns[c].length - 1].end <= chunk.start) {
                    break;
                }
            }
            if (chunk.end > group.end) {
                group.end = chunk.end;
            }
        } else {
            group = {
                columns: [],
                end: chunk.end
            };
        }

        if (group.columns.length < c + 1) {
            group.columns.push([]);
        }
        group.columns[c].push(chunk);

        chunk.group = group;
        chunk.column = c;
    }
}