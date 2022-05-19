import {createDate, cloneDate, toLocalDate} from './date';
import {assign} from './utils';
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
        start: createDate(event.start),
        end: createDate(event.end),
        title: event.title || '',
        editable: event.editable,
        startEditable: event.startEditable,
        durationEditable: event.durationEditable,
        display: display.includes(event.display) ? event.display : 'auto',
        extendedProps: event.extendedProps || {},
        backgroundColor: event.backgroundColor || event.color,
        isAllDay: event.isAllDay || false,
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
        if (typeof content === 'string') {
            content = {html: content};
        }
    } else if(chunk.event.isAllDay){
      content = {
        html:`<div class="${theme.eventTitle}">${chunk.event.title}</div>`
      };
    }
    else {
        switch (chunk.event.display) {
            case 'background':
                content = {html: ''};
                break;
            case 'pointer':
                content = {
                    html: `<div class="${theme.eventTime}">${timeText}</div>`
                };
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