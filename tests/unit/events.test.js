import {describe, expect, it} from 'vitest';
import {createEvents, eventIntersects} from '../../packages/core/src/lib/events.js';
import {createDate, toISOString} from '../../packages/core/src/lib/date.js';

function createEvent(input, offset = undefined) {
    return createEvents([input], offset)[0];
}

function str(date) {
    return toISOString(date);
}

describe('createEvents', () => {
    it('turns id into a string and generates a missing one', () => {
        expect(createEvent({id: 5, start: '2026-11-03', end: '2026-11-04'}).id).toBe('5');
        expect(createEvent({id: 0, start: '2026-11-03', end: '2026-11-04'}).id).toBe('0');
        for (let id of [undefined, null]) {
            expect(createEvent({id, start: '2026-11-03', end: '2026-11-04'}).id).toMatch(/^\{generated-\d+\}$/);
        }
    });

    it('detects all-day events by date-only strings', () => {
        expect(createEvent({start: '2026-11-03', end: '2026-11-04'}).allDay).toBe(true);
        expect(createEvent({start: '2026-11-03', end: '2026-11-03T12:00:00'}).allDay).toBe(false);
        expect(createEvent({start: '2026-11-03T10:00:00', end: '2026-11-03T12:00:00', allDay: true}).allDay)
            .toBe(true);
    });

    it('moves all-day events to midnight and covers the last day', () => {
        let event = createEvent({start: '2026-11-03T10:00:00', end: '2026-11-04T12:00:00', allDay: true});
        expect(str(event.start)).toBe('2026-11-03T00:00:00');
        expect(str(event.end)).toBe('2026-11-05T00:00:00');
    });

    it('gives a zero-length all-day event one day', () => {
        // https://github.com/vkurko/calendar/issues/50
        let event = createEvent({start: '2026-11-03', end: '2026-11-03'});
        expect(str(event.end)).toBe('2026-11-04T00:00:00');
    });

    it('collects resource ids, classes and styles into arrays', () => {
        let event = createEvent({
            start: '2026-11-03', end: '2026-11-04', resourceId: 1, className: 'a', style: 'color: red'
        });
        expect(event.resourceIds).toEqual(['1']);
        expect(event.classNames).toEqual(['a']);
        expect(event.styles).toEqual(['color: red']);
        event = createEvent({start: '2026-11-03', end: '2026-11-04', resourceIds: [1, 'b']});
        expect(event.resourceIds).toEqual(['1', 'b']);
    });

    it('applies defaults', () => {
        let event = createEvent({start: '2026-11-03', end: '2026-11-04', color: 'red'});
        expect(event.title).toBe('');
        expect(event.display).toBe('auto');
        expect(event.extendedProps).toEqual({});
        expect(event.backgroundColor).toBe('red');
        expect(event.layoutGroup).toBeUndefined();
        expect(createEvent({start: '2026-11-03', end: '2026-11-04', layoutGroup: 7}).layoutGroup).toBe('7');
    });
});

describe('eventIntersects', () => {
    let event = createEvent({start: '2026-11-03T10:00:00', end: '2026-11-03T12:00:00', resourceId: 'r1'});

    it('checks the date range with exclusive bounds', () => {
        expect(eventIntersects(event, createDate('2026-11-03T11:00:00'), createDate('2026-11-03T13:00:00')))
            .toBe(true);
        expect(eventIntersects(event, createDate('2026-11-03T12:00:00'), createDate('2026-11-03T13:00:00')))
            .toBe(false);
        expect(eventIntersects(event, createDate('2026-11-03T08:00:00'), createDate('2026-11-03T10:00:00')))
            .toBe(false);
    });

    it('checks the resource', () => {
        let start = createDate('2026-11-03'), end = createDate('2026-11-04');
        expect(eventIntersects(event, start, end, {id: 'r1'})).toBe(true);
        expect(eventIntersects(event, start, end, {id: 'r2'})).toBe(false);
    });
});
