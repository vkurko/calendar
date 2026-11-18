import {describe, expect, it} from 'vitest';
import {createDate} from '../../../packages/core/src/lib/date.js';
import {intl, intlRange} from '../../../packages/core/src/lib/derived.js';

// Tests run in Europe/Amsterdam and in the zones of vitest.config.js, the TZ variable is the zone of each run.
// Amsterdam's clocks go forward on 28 March 2027 at 02:00

const MINUTE = 60000;
const TIME = {hour: 'numeric', minute: 'numeric'};
const DATE_TIME = {month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric'};

function state(options) {
    return {options: {locale: 'en-US', ...options}};
}

// Normalizes the spaces that Intl puts around the digits and the dash
function text(value) {
    return value.replace(/\s+/g, ' ');
}

function isoOf(time) {
    return new Date(time).toISOString().substring(0, 19);
}

function nativeOffset(time) {
    return -new Date(time).getTimezoneOffset();
}

/**
 * Wall times (milliseconds as if UTC) around every hour that the clocks of the native time zone skip:
 * from one hour before it until one hour after it, every 5 minutes
 */
function wallTimesAroundSkippedHours() {
    let walls = [];
    let hour = 60 * MINUTE;
    for (let time = Date.UTC(2010, 0, 1); time < Date.UTC(2030, 0, 1); time += hour) {
        let [before, after] = [nativeOffset(time), nativeOffset(time + hour)];
        if (after > before) {
            // The change is within this hour, so the skipped wall times are between these limits
            let [first, last] = [time + before * MINUTE - hour, time + hour + after * MINUTE + hour];
            for (let wall = first; wall <= last; wall += 5 * MINUTE) {
                walls.push(wall);
            }
        }
    }

    return walls;
}

describe('intl', () => {
    it('formats the wall time of a date', () => {
        let {format} = intl(state({fmt: TIME}), 'fmt')();
        expect(text(format(createDate('2027-03-27T02:30:00')))).toBe('2:30 AM');
    });

    it('formats a time the browser skips as it is', () => {
        // In Amsterdam new Date(2027, 2, 28, 2, 30) shows 3:30
        let {format} = intl(state({fmt: TIME}), 'fmt')();
        expect(text(format(createDate('2027-03-28T02:30:00')))).toBe('2:30 AM');
        expect(text(format(createDate('2027-03-28T03:30:00')))).toBe('3:30 AM');
    });

    it('formats every minute around the skipped hours of the time zone as the wall time', () => {
        // Covers also zones that skip half an hour (Lord Howe) or a whole day (Apia)
        let {format} = intl(state({fmt: DATE_TIME}), 'fmt')();
        let utc = new Intl.DateTimeFormat('en-US', {...DATE_TIME, timeZone: 'UTC'});
        let walls = wallTimesAroundSkippedHours();
        expect(walls.filter(wall => text(format(createDate(isoOf(wall)))) !== text(utc.format(wall))).map(isoOf))
            .toEqual([]);
    });

    it('gives a formatting function a local Date', () => {
        let {format} = intl(state({fmt: date => date.getHours()}), 'fmt')();
        expect(format(createDate('2027-03-27T02:30:00'))).toBe(2);
    });
});

describe('intlRange', () => {
    it('formats the wall times of a range', () => {
        let {formatRange} = intlRange(state({fmt: TIME}), 'fmt')();
        expect(text(formatRange(createDate('2027-03-27T02:30:00'), createDate('2027-03-27T03:30:00'))))
            .toBe('2:30 – 3:30 AM');
        expect(text(formatRange(createDate('2027-03-27T02:30:00')))).toBe('2:30 AM');
    });

    it('formats a range with a time the browser skips as it is', () => {
        let {formatRange} = intlRange(state({fmt: TIME}), 'fmt')();
        expect(text(formatRange(createDate('2027-03-28T02:30:00'), createDate('2027-03-28T03:30:00'))))
            .toBe('2:30 – 3:30 AM');
        expect(text(formatRange(createDate('2027-03-28T01:30:00'), createDate('2027-03-28T02:15:00'))))
            .toBe('1:30 – 2:15 AM');
        expect(text(formatRange(createDate('2027-03-28T02:30:00')))).toBe('2:30 AM');
    });

    it('formats every range around the skipped hours of the time zone as the wall times', () => {
        let {formatRange} = intlRange(state({fmt: DATE_TIME}), 'fmt')();
        let utc = new Intl.DateTimeFormat('en-US', {...DATE_TIME, timeZone: 'UTC'});
        let walls = wallTimesAroundSkippedHours();
        let format = wall => text(formatRange(createDate(isoOf(wall)), createDate(isoOf(wall + 10 * MINUTE))));
        expect(walls.filter(wall => format(wall) !== text(utc.formatRange(wall, wall + 10 * MINUTE))).map(isoOf))
            .toEqual([]);
    });

    it('formats only the time of a range when asked to', () => {
        let {formatRange} = intlRange(state({fmt: TIME}), 'fmt', true)();
        expect(text(formatRange(createDate('2027-03-28T02:30:00'), createDate('2027-03-29T03:30:00'))))
            .toBe('2:30 – 3:30 AM');
    });

    it('formats a range that ends before it starts', () => {
        let {formatRange} = intlRange(state({fmt: TIME}), 'fmt')();
        expect(text(formatRange(createDate('2027-03-28T02:30:00'), createDate('2027-03-28T01:30:00'))))
            .toBe('2:30 – 1:30 AM');
    });
});
