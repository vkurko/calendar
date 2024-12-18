import {addDay, addDuration, datesEqual, createDate, cloneDate, setMidnight, toLocalDate, toISOString, noTimePart, copyTime} from './date';
import {createElement} from './dom';
import {assign, isArray, isFunction} from './utils';
import {toViewWithLocalDates} from './view';

let eventId = 1;
export function createEvents(input) {
    return input.map(event => {
        let result = {
            id: 'id' in event ? String(event.id) : `{generated-${eventId++}}`,
            resourceIds: toArrayProp(event, 'resourceId').map(String),
            allDay: event.allDay ?? (noTimePart(event.start) && noTimePart(event.end)),
            start: createDate(event.start),
            end: createDate(event.end),
            title: event.title ?? '',
            editable: event.editable,
            startEditable: event.startEditable,
            durationEditable: event.durationEditable,
            display: event.display ?? 'auto',
            extendedProps: event.extendedProps ?? {},
            backgroundColor: event.backgroundColor ?? event.color,
            textColor: event.textColor,
            classNames: toArrayProp(event, 'className'),
            styles: toArrayProp(event, 'style')
        };

        if (result.allDay) {
            // Make sure all-day events start and end at midnight
            setMidnight(result.start);
            let end = cloneDate(result.end);
            setMidnight(result.end);
            if (
                !datesEqual(result.end, end) ||
                datesEqual(result.end, result.start)  /** @see https://github.com/vkurko/calendar/issues/50 */
            ) {
                addDay(result.end);
            }
        }

        return result;
    });
}

function toArrayProp(input, propName) {
    let result = input[propName + 's'] ?? input[propName] ?? [];
    return isArray(result) ? result : [result];
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

export function createEventContent(chunk, displayEventEnd, eventContent, theme, _intlEventTime, _view) {
    let timeText = _intlEventTime.formatRange(
        chunk.start,
        displayEventEnd && chunk.event.display !== 'pointer' && !chunk.zeroDuration
            ? copyTime(cloneDate(chunk.start), chunk.end)  // make Intl.formatRange output only the time part
            : chunk.start
    );
    let content;

    if (eventContent) {
        content = isFunction(eventContent)
            ? eventContent({
                event: toEventWithLocalDates(chunk.event),
                timeText,
                view: toViewWithLocalDates(_view)
            })
            : eventContent;
    }

    if (content === undefined) {
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

export function handleZeroDurationChunk(chunk, preferredDuration) {
    if (datesEqual(chunk.start, chunk.end)) {
        chunk.zeroDuration = true;
        chunk.end = addDuration(cloneDate(chunk.end), preferredDuration);
    }
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
    let result = event.classNames;
    if (eventClassNames) {
        if (isFunction(eventClassNames)) {
            eventClassNames = eventClassNames({
                event: toEventWithLocalDates(event),
                view: toViewWithLocalDates(_view)
            });
        }
        result = [
            ...isArray(eventClassNames) ? eventClassNames : [eventClassNames],
            ...result
        ];
    }
    return result;
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
                // Adjust the start and end dates of the chunk if hidden days affected them
                if (chunk.start < dates[0]) {
                    chunk.start = dates[0];
                }
                let maxEnd = addDay(cloneDate(dates.at(-1)));
                if (chunk.end > maxEnd) {
                    chunk.end = maxEnd;
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
    if (longChunks[key]) {
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

export function runReposition(refs, data) {
    refs.length = data.length;
    let result = [];
    for (let ref of refs) {
        result.push(ref?.reposition?.());
    }
    return result;
}

/**
 * Check whether the event intersects with the given date range and resources
 * @param event
 * @param start
 * @param end
 * @param resources
 * @return boolean
 */
export function eventIntersects(event, start, end, resources) {
    if (event.start < end && event.end > start) {
        if (resources) {
            if (!isArray(resources)) {
                resources = [resources];
            }
            return resources.some(resource => event.resourceIds.includes(resource.id));
        }
        return true;
    }
    return false;
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
