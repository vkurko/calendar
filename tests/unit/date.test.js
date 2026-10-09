import {describe, expect, it} from 'vitest';
import {
    addDuration, convertOffset, createDate, createDuration, getOffset, getWeekNumber, nextDate, noTimePart,
    parseOffset, prevDate, resolveOffset, toISOString, toLocalDate
} from '../../packages/core/src/lib/date.js';

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
