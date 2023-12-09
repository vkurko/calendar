import {addDay, datesEqual, createDate, cloneDate, setMidnight, toLocalDate, toISOString, noTimePart, copyTime} from './date';
import {createElement} from './dom';
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
        allDay: event.allDay ?? (noTimePart(event.start) && noTimePart(event.end)),
        start: createDate(event.start),
        end: createDate(event.end),
        title: event.title || '',
        titleHTML: event.titleHTML || '',
        editable: event.editable,
        startEditable: event.startEditable,
        durationEditable: event.durationEditable,
        display: event.display || 'auto',
        extendedProps: event.extendedProps || {},
        backgroundColor: event.backgroundColor || event.color,
        textColor: event.textColor
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
    // Sort by start date (all-day events always on top)
    chunks.sort((a, b) => a.start - b.start || b.event.allDay - a.event.allDay);
}

/**
 * Prepare event chunks for month view and all-day slot in week view
 */
export function prepareEventChunks(chunks, hiddenDays) {
    let longChunks = {};

    if (chunks.length) {
        sortEventChunks(chunks);

        let prevChunk;
        for (let chunk of chunks) {
            let dates = [];
            let date = setMidnight(cloneDate(chunk.start));
            while (chunk.end > date) {
                if (!hiddenDays.includes(date.getUTCDay())) {
                    dates.push(cloneDate(date));
                    if (dates.length > 1) {
                        let key = date.getTime();
                        if (longChunks[key]) {
                            longChunks[key].chunks.push(chunk);
                        } else {
                            longChunks[key] = {
                                sorted: false,
                                chunks: [chunk]
                            };
                        }
                    }
                }
                addDay(date);
            }
            if (dates.length) {
                chunk.date = dates[0];
                chunk.days = dates.length;
                chunk.dates = dates;
                if (chunk.start < dates[0]) {
                    chunk.start = dates[0];
                }
                if (setMidnight(cloneDate(chunk.end)) > dates[dates.length - 1]) {
                    chunk.end = dates[dates.length - 1];
                }
            } else {
                chunk.date = setMidnight(cloneDate(chunk.start));
                chunk.days = 1;
                chunk.dates = [chunk.date];
            }

            if (prevChunk && datesEqual(prevChunk.date, chunk.date)) {
                chunk.prev = prevChunk;
            }
            prevChunk = chunk;
        }
    }

    return longChunks;
}

export function repositionEvent(chunk, longChunks, height) {
    chunk.top = 0;
    if (chunk.prev) {
        chunk.top = chunk.prev.bottom + 1;
    }
    chunk.bottom = chunk.top + height;
    let margin = 1;
    let key = chunk.date.getTime();
    if (longChunks[key]?.sorted || longChunks[key]?.chunks.every(chunk => 'top' in chunk)) {
        if (!longChunks[key].sorted) {
            longChunks[key].chunks.sort((a, b) => a.top - b.top);
            longChunks[key].sorted = true;
        }
        for (let longChunk of longChunks[key].chunks) {
            if (chunk.top < longChunk.bottom && chunk.bottom > longChunk.top) {
                let offset = longChunk.bottom - chunk.top + 1;
                margin += offset;
                chunk.top += offset;
                chunk.bottom += offset;
            }
        }
    }

    return margin;
}

export function createEventContent(chunk, displayEventEnd, eventContent, theme, _intlEventTime, _view) {
    let timeText = _intlEventTime.formatRange(
        chunk.start,
        displayEventEnd && chunk.event.display !== 'pointer'
            ? copyTime(cloneDate(chunk.start), chunk.end)  // make Intl.formatRange output only the time part
            : chunk.start
    );
    let content;

    if (eventContent) {
        content = is_function(eventContent)
            ? eventContent({
                event: toEventWithLocalDates(chunk.event),
                timeText,
                view: toViewWithLocalDates(_view)
            })
            : eventContent;
    } else {
        let domNodes;
        switch (chunk.event.display) {
            case 'background':
                domNodes = [];
                break;
            case 'pointer':
                domNodes = [createTimeElement(timeText, chunk, theme)];
                break;
            default:
                domNodes = [
                    ...chunk.event.allDay ? [] : [createTimeElement(timeText, chunk, theme)],
                    createElement('h4', theme.eventTitle, chunk.event.title)
                ];
        }
        content = {domNodes};
    }

    return [timeText, content];
}

function createTimeElement(timeText, chunk, theme) {
    return createElement(
        'time',
        theme.eventTime,
        timeText,
        [['datetime', toISOString(chunk.start)]]
    );
}

export function createEventClasses(eventClassNames, event, _view) {
    if (eventClassNames) {
        if (is_function(eventClassNames)) {
            eventClassNames = eventClassNames({
                event: toEventWithLocalDates(event),
                view: toViewWithLocalDates(_view)
            });
        }
        return Array.isArray(eventClassNames) ? eventClassNames : [eventClassNames];
    }
    return [];
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

/**
 * Check whether the event intersects with the given date range and resource
 * @param event
 * @param start
 * @param end
 * @param [resource]
 * @param [timeMode]  Zero-length events should be allowed (@see https://github.com/vkurko/calendar/issues/50), except in time mode
 * @return boolean
 */
export function eventIntersects(event, start, end, resource, timeMode) {
    return (
        event.start < end && event.end > start || !timeMode && datesEqual(event.start, event.end, start)
    ) && (
        resource === undefined || event.resourceIds.includes(resource.id)
    );
}

export function helperEvent(display) {
    return previewEvent(display) || ghostEvent(display) || pointerEvent(display);
}

export function bgEvent(display) {
    return display === 'background';
}

export function previewEvent(display) {
    return display === 'preview';
}

export function ghostEvent(display) {
    return display === 'ghost';
}

export function pointerEvent(display) {
    return display === 'pointer';
}
