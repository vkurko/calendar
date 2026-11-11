import {describe, expect, it} from 'vitest';
import {
    addDuration, convertOffset, createDate, createDuration, getOffset, getWeekNumber, nextDate, noTimePart,
    parseOffset, parseTimeZoneOffset, prevDate, resolveOffset, toISOString, toLocalDate
} from '../../packages/core/src/lib/date.js';
import {isTimeZoneName, zoneOffset, zoneWallOffset} from '../../packages/core/src/lib/time-zone.js';

// Tests run in Europe/Amsterdam (see vitest.config.js):
// UTC+2 in summer, UTC+1 in winter, clocks go back on 25 October 2026 and forward on 28 March 2027

function str(date) {
    return toISOString(date);
}

describe('createDate', () => {
    it('keeps the wall time of a string without a time zone', () => {
        let date = createDate('2026-11-03T10:00:00');
        expect(str(date)).toBe('2026-11-03T10:00:00');
        expect(getOffset(date)).toBeUndefined();
    });

    it('parses a date-only string as midnight', () => {
        expect(str(createDate('2026-11-03'))).toBe('2026-11-03T00:00:00');
    });

    it('keeps the wall time of a string with an offset when no target offset is given', () => {
        for (let [input, offset] of [
            ['2026-11-03T10:00:00Z', 0],
            ['2026-11-03T10:00:00+01:00', 60],
            ['2026-11-03T10:00:00+0200', 120],
            ['2026-11-03T10:00:00-05:30', -330]
        ]) {
            let date = createDate(input);
            expect(str(date)).toBe('2026-11-03T10:00:00');
            expect(getOffset(date)).toBe(offset);
        }
    });

    it('converts a string with an offset to a fixed target offset', () => {
        let date = createDate('2026-11-03T09:00:00Z', 180);
        expect(str(date)).toBe('2026-11-03T12:00:00');
        expect(getOffset(date)).toBe(180);
    });

    it('converts a string with an offset to local time using the offset of that date', () => {
        // Winter time
        let date = createDate('2026-11-03T09:00:00Z', 'local');
        expect(str(date)).toBe('2026-11-03T10:00:00');
        expect(getOffset(date)).toBe(60);
        // Summer time
        date = createDate('2027-04-03T09:00:00Z', 'local');
        expect(str(date)).toBe('2027-04-03T11:00:00');
        expect(getOffset(date)).toBe(120);
    });

    it('brands a floating string with the local offset of its wall time', () => {
        expect(getOffset(createDate('2026-11-03T10:00:00', 'local'))).toBe(60);
        expect(getOffset(createDate('2027-04-03T10:00:00', 'local'))).toBe(120);
        // The night the clocks go back: 01:30 is still summer time
        expect(getOffset(createDate('2026-10-25T01:30:00', 'local'))).toBe(120);
    });

    it('keeps the wall time of a Date in local mode on both sides of a DST change', () => {
        // https://github.com/vkurko/calendar/issues/686
        for (let offset of [undefined, 'local']) {
            let winter = createDate(new Date(2026, 10, 3, 10, 0), offset);
            expect(str(winter)).toBe('2026-11-03T10:00:00');
            expect(getOffset(winter)).toBe(60);
            let summer = createDate(new Date(2027, 3, 3, 10, 0), offset);
            expect(str(summer)).toBe('2027-04-03T10:00:00');
            expect(getOffset(summer)).toBe(120);
        }
    });

    it('converts a Date to a fixed target offset', () => {
        let date = createDate(new Date(2026, 10, 3, 10, 0), 0);
        expect(str(date)).toBe('2026-11-03T09:00:00');
        expect(getOffset(date)).toBe(0);
    });
});

describe('parseOffset', () => {
    it('parses Z and offsets with or without a colon', () => {
        expect(parseOffset('2026-11-03T10:00:00Z')).toBe(0);
        expect(parseOffset('2026-11-03T10:00:00+02:00')).toBe(120);
        expect(parseOffset('2026-11-03T10:00:00+0200')).toBe(120);
        expect(parseOffset('2026-11-03T10:00:00-05:30')).toBe(-330);
    });

    it('returns undefined when there is no offset', () => {
        expect(parseOffset('2026-11-03T10:00:00')).toBeUndefined();
        expect(parseOffset('local')).toBeUndefined();
    });
});

describe('parseTimeZoneOffset', () => {
    it('parses a string that is an offset and nothing else', () => {
        expect(parseTimeZoneOffset('Z')).toBe(0);
        expect(parseTimeZoneOffset('+05:30')).toBe(330);
        expect(parseTimeZoneOffset('-0600')).toBe(-360);
    });

    it('returns undefined for a string with more than the offset', () => {
        // NZ is a time zone name that ends with the letter Z
        expect(parseTimeZoneOffset('NZ')).toBeUndefined();
        expect(parseTimeZoneOffset('Etc/GMT+05:30')).toBeUndefined();
        expect(parseTimeZoneOffset('2026-11-03T10:00:00+02:00')).toBeUndefined();
        expect(parseTimeZoneOffset('local')).toBeUndefined();
    });
});

describe('convertOffset', () => {
    it('shifts the wall time by the difference of offsets', () => {
        let date = convertOffset(createDate('2026-11-03T10:00:00'), 60, 0);
        expect(str(date)).toBe('2026-11-03T09:00:00');
        expect(getOffset(date)).toBe(0);
    });

    it('uses the local offset at the moment of the date for local', () => {
        let date = convertOffset(createDate('2026-11-03T09:00:00'), 0, 'local');
        expect(str(date)).toBe('2026-11-03T10:00:00');
        expect(getOffset(date)).toBe(60);
    });
});

describe('resolveOffset', () => {
    it('returns a number for local and passes other values through', () => {
        let date = createDate('2026-11-03T10:00:00');
        expect(resolveOffset(date, 'local')).toBe(60);
        expect(resolveOffset(date, 180)).toBe(180);
        expect(resolveOffset(date, undefined)).toBeUndefined();
    });

    it('gives a time in the hour the clocks skip the offset before the change, as a Date moves it forward', () => {
        // 02:30 on 28 March 2027 does not exist, new Date(2027, 2, 28, 2, 30) is 03:30
        let date = createDate('2027-03-28T02:30:00');
        expect(resolveOffset(date, 'local')).toBe(60);
        expect(str(convertOffset(date, 60, 0))).toBe(new Date(2027, 2, 28, 2, 30).toISOString().substring(0, 19));
    });

    it('gives a time in the hour the clocks repeat the offset of its first occurrence', () => {
        // 02:30 on 25 October 2026 happens twice, new Date(2026, 9, 25, 2, 30) is the first one
        let date = createDate('2026-10-25T02:30:00');
        expect(resolveOffset(date, 'local')).toBe(120);
        expect(str(convertOffset(date, 120, 0))).toBe(new Date(2026, 9, 25, 2, 30).toISOString().substring(0, 19));
    });
});

describe('IANA time zone names', () => {
    // These do not depend on the zone of the test run, tests/unit/zones/time-zone.test.js compares them with local
    it('are told apart from other timeZone values', () => {
        expect(isTimeZoneName('America/Los_Angeles')).toBe(true);
        expect(isTimeZoneName('Etc/GMT+5')).toBe(true);
        expect(isTimeZoneName('NZ')).toBe(true);
        expect(isTimeZoneName('UTC')).toBe(true);
        expect(isTimeZoneName('local')).toBe(false);
        expect(isTimeZoneName('Europe/Atlantis')).toBe(false);
        expect(isTimeZoneName('')).toBe(false);
    });

    it('convert a string with an offset using the offset of that moment', () => {
        for (let [zone, input, expected, offset] of [
            // Clocks go forward on 14 March 2027 at 10:00 UTC and back on 1 November 2026 at 09:00 UTC (west of UTC)
            ['America/Los_Angeles', '2027-03-14T09:59:00Z', '2027-03-14T01:59:00', -480],
            ['America/Los_Angeles', '2027-03-14T10:00:00Z', '2027-03-14T03:00:00', -420],
            ['America/Los_Angeles', '2026-11-01T08:30:00Z', '2026-11-01T01:30:00', -420],
            ['America/Los_Angeles', '2026-11-01T09:30:00Z', '2026-11-01T01:30:00', -480],
            // Clocks go forward on 28 March 2027 at 01:00 UTC and back on 25 October 2026 at 01:00 UTC (east of UTC)
            ['Europe/Berlin', '2027-03-28T00:59:00Z', '2027-03-28T01:59:00', 60],
            ['Europe/Berlin', '2027-03-28T01:00:00Z', '2027-03-28T03:00:00', 120],
            ['Europe/Berlin', '2026-10-25T00:30:00Z', '2026-10-25T02:30:00', 120],
            ['Europe/Berlin', '2026-10-25T01:30:00Z', '2026-10-25T02:30:00', 60],
            // Southern hemisphere, the change is by half an hour
            ['Australia/Lord_Howe', '2026-10-03T15:29:00Z', '2026-10-04T01:59:00', 630],
            ['Australia/Lord_Howe', '2026-10-03T15:30:00Z', '2026-10-04T02:30:00', 660],
            ['Australia/Lord_Howe', '2027-04-03T14:45:00Z', '2027-04-04T01:45:00', 660],
            ['Australia/Lord_Howe', '2027-04-03T15:15:00Z', '2027-04-04T01:45:00', 630],
            // No DST, half an hour offset
            ['Asia/Kolkata', '2027-03-14T10:00:00Z', '2027-03-14T15:30:00', 330],
            // A name that ends with the letter Z is not UTC
            ['NZ', '2027-03-14T10:00:00Z', '2027-03-14T23:00:00', 780],
            // The input offset does not matter
            ['Europe/Berlin', '2027-03-28T03:00:00+02:00', '2027-03-28T03:00:00', 120],
            ['Europe/Berlin', '2027-03-27T18:00:00-07:00', '2027-03-28T03:00:00', 120]
        ]) {
            let date = createDate(input, zone);
            expect([zone, input, str(date), getOffset(date)]).toEqual([zone, input, expected, offset]);
        }
    });

    it('brand a string without an offset with the offset of its wall time', () => {
        for (let [zone, input, offset] of [
            ['America/Los_Angeles', '2027-03-14T01:59:00', -480],
            ['America/Los_Angeles', '2027-03-14T03:00:00', -420],
            ['Europe/Berlin', '2026-10-24T12:00:00', 120],
            ['Europe/Berlin', '2026-10-26T12:00:00', 60],
            ['Asia/Kolkata', '2026-10-26T12:00:00', 330]
        ]) {
            let date = createDate(input, zone);
            expect([zone, input, str(date), getOffset(date)]).toEqual([zone, input, input, offset]);
        }
    });

    it('treat a skipped wall time like a native Date does, moved forward', () => {
        for (let [zone, input, offset, utc] of [
            ['America/Los_Angeles', '2027-03-14T02:30:00', -480, '2027-03-14T10:30:00'],
            ['Europe/Berlin', '2027-03-28T02:30:00', 60, '2027-03-28T01:30:00'],
            ['Australia/Lord_Howe', '2026-10-04T02:15:00', 630, '2026-10-03T15:45:00'],
            // Chile skips midnight
            ['America/Santiago', '2026-09-06T00:30:00', -240, '2026-09-06T04:30:00']
        ]) {
            let date = createDate(input, zone);
            expect([zone, input, str(date), getOffset(date)]).toEqual([zone, input, input, offset]);
            expect([zone, str(convertOffset(date, offset, 0))]).toEqual([zone, utc]);
        }
    });

    it('treat a repeated wall time like a native Date does, as the first occurrence', () => {
        for (let [zone, input, offset, utc] of [
            ['America/Los_Angeles', '2026-11-01T01:30:00', -420, '2026-11-01T08:30:00'],
            ['Europe/Berlin', '2026-10-25T02:30:00', 120, '2026-10-25T00:30:00'],
            ['Australia/Lord_Howe', '2027-04-04T01:45:00', 660, '2027-04-03T14:45:00'],
            // Chile repeats the hour before midnight
            ['America/Santiago', '2027-04-03T23:30:00', -180, '2027-04-04T02:30:00']
        ]) {
            let date = createDate(input, zone);
            expect([zone, input, str(date), getOffset(date)]).toEqual([zone, input, input, offset]);
            expect([zone, str(convertOffset(date, offset, 0))]).toEqual([zone, utc]);
        }
    });

    it('convert from one zone to another with convertOffset and resolveOffset', () => {
        let date = convertOffset(createDate('2027-03-28T01:30:00'), 0, 'Europe/Berlin');
        expect([str(date), getOffset(date)]).toEqual(['2027-03-28T03:30:00', 120]);
        date = convertOffset(date, 120, 'America/Los_Angeles');
        expect([str(date), getOffset(date)]).toEqual(['2027-03-27T18:30:00', -420]);
        expect(resolveOffset(createDate('2026-10-25T02:30:00'), 'Europe/Berlin')).toBe(120);
        expect(resolveOffset(createDate('2026-10-25T03:30:00'), 'Europe/Berlin')).toBe(60);
    });

    it('resolve the years 1 to 99 and the years before 1', () => {
        // Berlin has local mean time (UTC+0:53:28) until 1893, Los Angeles (UTC-7:52:58) until 1883
        let at = year => new Date(0).setUTCFullYear(year);
        for (let year of [1, 50, 99, 100, 1000, 0, -100]) {
            expect([year, zoneOffset('Europe/Berlin', at(year)), zoneWallOffset('Europe/Berlin', at(year))])
                .toEqual([year, 53, 53]);
            expect([year, zoneOffset('America/Los_Angeles', at(year)), zoneWallOffset('America/Los_Angeles', at(year))])
                .toEqual([year, -473, -473]);
        }
    });

    it('give NaN for an invalid date or one out of range, as local does', () => {
        for (let time of [NaN, Infinity, -Infinity, 8.64e15 + 1, -8.64e15 - 1]) {
            expect(zoneOffset('Europe/Berlin', time)).toBeNaN();
        }
        for (let wall of [NaN, Infinity, -Infinity]) {
            expect(zoneWallOffset('Europe/Berlin', wall)).toBeNaN();
        }
        // The latest date is out of range after the conversion
        expect(() => zoneWallOffset('Europe/Berlin', 8.64e15)).not.toThrow();
        for (let input of [new Date(NaN), new Date(8.64e15)]) {
            let local = createDate(input, 'local');
            let zoned = createDate(input, 'Europe/Berlin');
            expect([zoned.getTime(), getOffset(zoned)]).toEqual([local.getTime(), getOffset(local)]);
        }
    });
});

describe('toLocalDate', () => {
    it('creates a local Date with the same wall time', () => {
        let date = toLocalDate(createDate('2026-11-03T10:30:15'));
        expect([date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(),
            date.getSeconds()]).toEqual([2026, 10, 3, 10, 30, 15]);
    });
});

describe('noTimePart', () => {
    it('detects date-only strings', () => {
        expect(noTimePart('2026-11-03')).toBe(true);
        expect(noTimePart('2026-11-03T10:00:00')).toBe(false);
        expect(noTimePart(new Date())).toBe(false);
    });
});

describe('createDuration', () => {
    it('parses seconds, strings and objects', () => {
        expect(createDuration(90).seconds).toBe(90);
        expect(createDuration('01:30').seconds).toBe(5400);
        expect(createDuration('01:30:15').seconds).toBe(5415);
        expect(createDuration({hours: 1, minutes: 30}).seconds).toBe(5400);
        expect(createDuration({day: 2}).days).toBe(2);
        expect(createDuration({months: 1}).months).toBe(1);
    });

    it('turns weeks into days and remembers that', () => {
        let duration = createDuration({weeks: 2, days: 1});
        expect(duration.days).toBe(15);
        expect(duration.inWeeks).toBe(true);
        expect(createDuration({days: 14}).inWeeks).toBe(false);
    });
});

describe('addDuration', () => {
    it('clamps to the last day of a shorter month', () => {
        let date = addDuration(createDate('2026-01-31'), createDuration({months: 1}));
        expect(str(date)).toBe('2026-02-28T00:00:00');
    });

    it('subtracts with a negative multiplier', () => {
        let date = addDuration(createDate('2026-03-31'), createDuration({months: 1}), -1);
        expect(str(date)).toBe('2026-02-28T00:00:00');
    });

    it('is not affected by DST changes', () => {
        let date = addDuration(createDate('2026-10-24T12:00:00'), createDuration({days: 1}));
        expect(str(date)).toBe('2026-10-25T12:00:00');
        date = addDuration(createDate('2026-10-25T00:00:00'), createDuration('24:00'));
        expect(str(date)).toBe('2026-10-26T00:00:00');
    });
});

describe('nextDate and prevDate', () => {
    it('skip hidden days', () => {
        let day = createDuration({days: 1});
        // 2026-11-06 is Friday, Saturday and Sunday are hidden
        expect(str(nextDate(createDate('2026-11-06'), day, [0, 6]))).toBe('2026-11-09T00:00:00');
        expect(str(prevDate(createDate('2026-11-09'), day, [0, 6]))).toBe('2026-11-06T00:00:00');
    });

    it('do not loop when all days are hidden', () => {
        let day = createDuration({days: 1});
        expect(str(nextDate(createDate('2026-11-06'), day, [0, 1, 2, 3, 4, 5, 6]))).toBe('2026-11-07T00:00:00');
    });
});

describe('getWeekNumber', () => {
    it('uses ISO weeks when the week starts on Monday', () => {
        expect(getWeekNumber(createDate('2026-01-01'), 1)).toBe(1);
        expect(getWeekNumber(createDate('2027-01-01'), 1)).toBe(53);
    });

    it('uses western weeks when the week starts on Sunday', () => {
        expect(getWeekNumber(createDate('2026-01-01'), 0)).toBe(1);
        expect(getWeekNumber(createDate('2026-12-27'), 0)).toBe(1);
    });
});
