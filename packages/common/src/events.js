import {createDate, toLocalDate} from './date';
import {assign} from './utils';
import {toViewWithLocalDates} from './view';
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

export function createEventSources(input) {
    return input.map(source => ({
        url: (source.url && source.url.trimEnd('&')) || '',
        method: (source.method && source.method.toUpperCase()) || 'GET',
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
                event: toEventWithLocalDates(chunk.event),
                timeText,
                view: toViewWithLocalDates(_view)
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
                    html: `<div class="${theme.eventTime}">${timeText}</div>` +
                        `<div class="${theme.eventTitle}">${chunk.event.title}</div>`
                };
        }
    }

    return [timeText, content];
}

export function toEventWithLocalDates(event) {
    event = assign({}, event);
    event.start = toLocalDate(event.start);
    event.end = toLocalDate(event.end);

    return event;
}