import {createDate} from './date';
import {is_function} from 'svelte/internal';

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

export function createEventContent(chunk, displayEventEnd, eventContent, theme, _intlEventTime, _view) {
    let timeText = _intlEventTime.format(chunk.start), content;
    if (displayEventEnd) {
        timeText += ` - ${_intlEventTime.format(chunk.end)}`;
    }
    if (eventContent) {
        content = is_function(eventContent)
            ? eventContent({
                event: chunk.event,
                timeText,
                view: _view
            })
            : eventContent;
        if (typeof content === 'string') {
            content = {html: content};
        }
    } else {
        switch (chunk.event.display) {
            case 'background':
                content = {html: ''};
                break;
            default:
                content = {
                    html: `<div class="${theme.eventContent}">` +
                        `<div class="${theme.eventTime}">${timeText}</div>` +
                        `<div class="${theme.eventTitle}">${chunk.event.title}</div>` +
                        `</div>`
                };
        }
    }

    return [timeText, content];
}