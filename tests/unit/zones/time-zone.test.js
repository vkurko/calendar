import {describe, expect, it} from 'vitest';
import {createDate, getOffset, resolveOffset, toISOString} from '../../../packages/core/src/lib/date.js';
import {zoneOffset, zoneWallOffset} from '../../../packages/core/src/lib/time-zone.js';

// The browser's own time zone ('local') is the reference: the zone name that vitest.config.js sets as TZ
// must give the same offsets and dates as 'local' does, in particular around DST changes
const zone = process.env.TZ;
const MINUTE = 60000;
// Zones without DST changes in the checked years
const FIXED_OFFSET = ['Asia/Kolkata'];

function nativeOffset(time) {
    return -new Date(time).getTimezoneOffset();
}

/**
 * Find the changes of the offset of the native time zone: {time, before, after}
 */
function findChanges(from, to) {
    let changes = [];
    let step = 60 * MINUTE;
    for (let time = from; time < to; time += step) {
        let before = nativeOffset(time);
        if (before !== nativeOffset(time + step)) {
            // Bisect to the first minute with the new offset
            let low = time, high = time + step;
            while (high - low > MINUTE) {
                let mid = low + Math.floor((high - low) / MINUTE / 2) * MINUTE;
                if (nativeOffset(mid) === before) {
                    low = mid;
                } else {
                    high = mid;
                }
            }
            changes.push({time: high, before, after: nativeOffset(high)});
        }
    }

    return changes;
}

const changes = findChanges(Date.UTC(2010, 0, 1), Date.UTC(2030, 0, 1));

/**
 * Instants from two hours before a change until two hours after it, minute by minute
 */
function instantsAround({time}) {
    return Array.from({length: 241}, (_, i) => time + (i - 120) * MINUTE);
}

/**
 * Wall times (milliseconds as if UTC) from two hours before the clock jumps until two hours after it
 */
function wallTimesAround({time, before, after}) {
    let first = time + Math.min(before, after) * MINUTE - 120 * MINUTE;
    let last = time + Math.max(before, after) * MINUTE + 120 * MINUTE;
    let walls = [];
    for (let wall = first; wall <= last; wall += MINUTE) {
        walls.push(wall);
    }

    return walls;
}

function isoOf(time) {
    return new Date(time).toISOString().substring(0, 19);
}

/**
 * Collect the inputs for which fn gives different results for 'local' and for the zone name
 */
function mismatches(inputs, fn) {
    let result = [];
    for (let input of inputs) {
        let [expected, actual] = [fn(input, 'local'), fn(input, zone)];
        if (JSON.stringify(expected) !== JSON.stringify(actual)) {
            result.push({input: isoOf(input), expected, actual});
        }
    }

    return result;
}

function dateAndOffset(date) {
    return [toISOString(date), getOffset(date)];
}

describe(`time zone ${zone}`, () => {
    it('runs in the time zone under test', () => {
        let resolved = timeZone => new Intl.DateTimeFormat('en-US', {timeZone}).resolvedOptions().timeZone;
        expect(resolved(undefined)).toBe(resolved(zone));
    });

    it('has the offset changes that the other tests rely on', () => {
        if (FIXED_OFFSET.includes(zone)) {
            expect(changes).toEqual([]);
        } else {
            expect(changes.some(change => change.after > change.before)).toBe(true);
            expect(changes.some(change => change.after < change.before)).toBe(true);
        }
    });

    it('gives the offset of an instant like local does', () => {
        let times = changes.flatMap(instantsAround);
        // Also one instant every 6 hours over all years
        for (let time = Date.UTC(2010, 0, 1); time < Date.UTC(2030, 0, 1); time += 360 * MINUTE) {
            times.push(time);
        }
        expect(times.filter(time => zoneOffset(zone, time) !== nativeOffset(time)).map(isoOf)).toEqual([]);
    });

    it('reads a wall time as the instant a native Date does, in the skipped and in the repeated hour too', () => {
        let walls = changes.flatMap(wallTimesAround);
        let nativeInstant = wall => {
            let date = new Date(wall);
            return new Date(
                date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
                date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()
            ).getTime();
        };
        expect(walls.filter(wall => wall - zoneWallOffset(zone, wall) * MINUTE !== nativeInstant(wall)).map(isoOf))
            .toEqual([]);
        expect(mismatches(walls, (wall, offset) => resolveOffset(new Date(wall), offset))).toEqual([]);
    });

    it('converts a Date like local does', () => {
        let times = changes.flatMap(instantsAround);
        expect(mismatches(times, (time, offset) => dateAndOffset(createDate(new Date(time), offset)))).toEqual([]);
    });

    it('converts a string with an offset like local does', () => {
        let times = changes.flatMap(instantsAround);
        expect(mismatches(times, (time, offset) => dateAndOffset(createDate(isoOf(time) + 'Z', offset)))).toEqual([]);
    });

    it('brands a string without an offset like local does, in the skipped and in the repeated hour too', () => {
        let walls = changes.flatMap(wallTimesAround);
        expect(mismatches(walls, (wall, offset) => dateAndOffset(createDate(isoOf(wall), offset)))).toEqual([]);
    });
});
