import {
    addDay, cloneDate, copyTime, createDate, datesEqual, noTimePart, setMidnight, toISOString, toLocalDate
} from './date.js';
import {createElement} from './dom.js';
import {assign, isArray, isFunction} from './utils.js';
import {toViewWithLocalDates} from './view.js';

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
                domNodes = chunk.event.allDay ? [] : [createTimeElement(timeText, chunk, theme)];
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

export function runReposition(refs, data) {
    refs.length = data.length;
    for (let ref of refs) {
        ref?.reposition();
    }
}

/**
 * Check whether the event intersects with the given date range and resource
 * @param event
 * @param start
 * @param end
 * @param resource
 * @return boolean
 */
export function eventIntersects(event, start, end, resource = undefined) {
    return (!resource || event.resourceIds.includes(resource.id)) && event.start < end && event.end > start;

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
