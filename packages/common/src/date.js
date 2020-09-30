export const DAY_IN_SECONDS = 86400;

function fromISOString(str) {
    const parts = str.match(/\d+/g);
    return new Date(
        Number(parts[0]),
        Number(parts[1]) - 1,
        Number(parts[2]),
        Number(parts[3] || 0),
        Number(parts[4] || 0),
        Number(parts[5] || 0)
    );
}

export function createDate(input) {
    return input !== undefined
        ? (input instanceof Date ? cloneDate(input) : fromISOString(input))
        : new Date();
}

export function createDuration(input) {
    if (typeof input === 'number') {
        input = {seconds: input};
    } else if (typeof input === 'string') {
        // Expected format hh[:mm[:ss]]
        let seconds = 0, exp = 2;
        for (let part of input.split(':', 3)) {
            seconds += parseInt(part, 10) * Math.pow(60, exp--);
        }
        input = {seconds};
    } else if (input instanceof Date) {
        input = {hours: input.getHours(), minutes: input.getMinutes(), seconds: input.getSeconds()};
    }

    let weeks = input.weeks || input.week || 0;

    return {
        years: input.years || input.year || 0,
        months: input.months || input.month || 0,
        days: weeks * 7 + (input.days || input.day || 0),
        seconds: (input.hours || input.hour || 0) * 60 * 60 +
            (input.minutes || input.minute || 0) * 60 +
            (input.seconds || input.second || 0),
        inWeeks: !!weeks
    };
}

export function cloneDate(date) {
    return new Date(date.getTime());
}

export function addDuration(date, duration, multiplier) {
    return _addSubDuration(date, duration, multiplier === undefined ? +1 : multiplier);
}

export function subtractDuration(date, duration, multiplier) {
    return _addSubDuration(date, duration, multiplier === undefined ? -1 : multiplier);
}

export function addDay(date) {
    return _addSubDays(date, +1);
}

export function subtractDay(date) {
    return _addSubDays(date, -1);
}

export function setMidnight(date) {
    date.setHours(0, 0, 0, 0);

    return date;
}

export function toISOString(date) {
    let tzo = -date.getTimezoneOffset(),
        dif = tzo >= 0 ? '+' : '-';

    return date.getFullYear() +
        '-' + _pad(date.getMonth() + 1) +
        '-' + _pad(date.getDate()) +
        'T' + _pad(date.getHours()) +
        ':' + _pad(date.getMinutes()) +
        ':' + _pad(date.getSeconds()) +
        dif + _pad(tzo / 60) +
        ':' + _pad(tzo % 60);
}

export function formatRange(start, end, intl) {
    if (start.getFullYear() !== end.getFullYear()) {
        return intl.format(start) + ' - ' + intl.format(end);
    }

    let diff = [];
    if (start.getMonth() !== end.getMonth()) {
        diff.push('month');
    }
    if (start.getDate() !== end.getDate()) {
        diff.push('day');
    }

    if (!diff.length) {
        return intl.format(start);
    }

    let opts1 = intl.resolvedOptions();
    let opts2 = {};
    for (let key of diff) {
        opts2[key] = opts1[key];
    }
    let intl2 = new Intl.DateTimeFormat(opts1.locale, opts2);

    let full1 = intl.format(start);
    let full2 = intl.format(end);
    let part1 = intl2.format(start);
    let part2 = intl2.format(end);

    let common = _commonChunks(full1, part1, full2, part2);
    if (common) {
        return common.head + part1 + ' - ' + part2 + common.tail;
    }

    return full1 + ' - ' + full2;
}

export function datesEqual(date1, date2) {
    return date1.getTime() === date2.getTime();
}

export function nextClosestDay(date, day) {
    let diff = day - date.getDay();
    date.setDate(date.getDate() + (diff >= 0 ? diff : diff + 7));
    return date;
}

export function prevClosestDay(date, day) {
    let diff = day - date.getDay();
    date.setDate(date.getDate() + (diff <= 0 ? diff : diff - 7));
    return date;
}

/**
 * Private functions
 */

function _addSubDuration(date, duration, x) {
    date.setFullYear(date.getFullYear() + x * duration.years);
    let month = date.getMonth() + x * duration.months;
    date.setMonth(month);
    month %= 12;
    if (month < 0) {
        month += 12;
    }
    while (date.getMonth() !== month) {
        subtractDay(date);
    }
    date.setDate(date.getDate() + x * duration.days);
    date.setSeconds(date.getSeconds() + x * duration.seconds);

    return date;
}

function _addSubDays(date, x) {
    date.setDate(date.getDate() + x);

    return date;
}

function _pad(num) {
    let norm = Math.floor(Math.abs(num));
    return (norm < 10 ? '0' : '') + norm;
}

function _commonChunks(str1, substr1, str2, substr2) {
    let i = 0;
    while (i < str1.length) {
        let res1;
        [i, res1] = _cut(str1, substr1, i);
        if (!res1) {
            break;
        }

        let j = 0;
        while (j < str2.length) {
            let res2;
            [j, res2] = _cut(str2, substr2, j);
            if (!res2) {
                break;
            }

            if (res1.head === res2.head && res1.tail === res2.tail) {
                return res1;
            }
        }
    }

    return null
}

function _cut(str, substr, from) {
    let start = str.indexOf(substr, from);
    if (start >= 0) {
        let end = start + substr.length;

        return [end, {
            head: str.substr(0, start),
            tail: str.substr(end)
        }];
    }

    return [-1, null];
}
