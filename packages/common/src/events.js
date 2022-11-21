import {createDate, cloneDate, toLocalDate} from './date';
import {assign, createElement} from './utils';
import {toViewWithLocalDates} from './view';
import {is_function} from 'svelte/internal';

const display = ['background'];

let eventId = 1;
export function createEvents(input) {
    return input.map(event => ({
        id: 'id' in event ? String(event.id) : `{generated-${eventId++}}`,
        resourceIds: Array.isArray(event.resourceIds)
            ? event.resourceIds.map(String)
            : ('resourceId' in event ? [String(event.resourceId)] : []),
        allDay: event.allDay || false,
        start: createDate(event.start),
        end: createDate(event.end),
        title: event.title || '',
        titleHTML: event.titleHTML || '',
        editable: event.editable,
        startEditable: event.startEditable,
        durationEditable: event.durationEditable,
        display: display.includes(event.display) ? event.display : 'auto',
        extendedProps: event.extendedProps || {},
        backgroundColor: event.backgroundColor || event.color
    }));
}

export function createEventSources(input) {
    return input.map(source => ({
        events: source.events,
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
    if (displayEventEnd && chunk.event.display !== 'pointer') {
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
    } else {
        switch (chunk.event.display) {
            case 'background':
                content = '';
                break;
            case 'pointer':
                content = {
                    domNodes: [createElement('div', theme.eventTime, null, timeText)]
                };
                break;
            default:
                content = {
                    domNodes: [
                        createElement('div', theme.eventTime, null, timeText),
                        createElement('div', theme.eventTitle, chunk.event.titleHTML, chunk.event.title)
                    ]
                };
        }
    }

    return [timeText, content];
}

export function toEventWithLocalDates(event) {
    return _cloneEvent(event, toLocalDate);
}

export function cloneEvent(event) {
    return _cloneEvent(event, cloneDate);
}

function _cloneEvent(event, dateFn) {
    event = assign({}, event);
    event.start = dateFn(event.start);
    event.end = dateFn(event.end);

    return event;
}