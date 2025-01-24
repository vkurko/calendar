export const DAY_IN_SECONDS = 86400;

export function createDate(input = undefined) {
    if (input !== undefined) {
        return input instanceof Date ? _fromLocalDate(input) : _fromISOString(input);
    }

    return _fromLocalDate(new Date());
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
        input = {hours: input.getUTCHours(), minutes: input.getUTCMinutes(), seconds: input.getUTCSeconds()};
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

export function addDuration(date, duration, x = 1) {
    date.setUTCFullYear(date.getUTCFullYear() + x * duration.years);
    let month = date.getUTCMonth() + x * duration.months;
    date.setUTCMonth(month);
    month %= 12;
    if (month < 0) {
        month += 12;
    }
    while (date.getUTCMonth() !== month) {
        subtractDay(date);
    }
    date.setUTCDate(date.getUTCDate() + x * duration.days);
    date.setUTCSeconds(date.getUTCSeconds() + x * duration.seconds);

    return date;
}

export function subtractDuration(date, duration, x = 1) {
    return addDuration(date, duration, -x);
}

export function addDay(date, x = 1) {
    date.setUTCDate(date.getUTCDate() + x);

    return date;
}

export function subtractDay(date, x = 1) {
    return addDay(date, -x);
}

export function setMidnight(date) {
    date.setUTCHours(0, 0, 0, 0);

    return date;
}

export function toLocalDate(date) {
    return new Date(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        date.getUTCHours(),
        date.getUTCMinutes(),
        date.getUTCSeconds()
    );
}

export function toISOString(date, len = 19) {
    return date.toISOString().substring(0, len);
}

export function datesEqual(date1, ...dates2) {
    return dates2.every(date2 => date1.getTime() === date2.getTime());
}

export function nextClosestDay(date, day) {
    let diff = day - date.getUTCDay();
    date.setUTCDate(date.getUTCDate() + (diff >= 0 ? diff : diff + 7));
    return date;
}

export function prevClosestDay(date, day) {
    let diff = day - date.getUTCDay();
    date.setUTCDate(date.getUTCDate() + (diff <= 0 ? diff : diff - 7));
    return date;
}

/**
 * Check whether given date is string which contains no time part
  */
export function noTimePart(date) {
    return typeof date === 'string' && date.length <= 10;
}

/**
 * Copy time from one date to another
 */
export function copyTime(toDate, fromDate) {
    toDate.setUTCHours(fromDate.getUTCHours(), fromDate.getUTCMinutes(), fromDate.getUTCSeconds(), 0);

    return toDate;
}

/**
 * Get duration value in seconds
 */
export function toSeconds(duration) {
    return duration.seconds;
}

/**
 * Move the date forward (when pressing the next button)
 */
export function nextDate(date, duration) {
    addDuration(date, duration);
    return date;
}

/**
 * Move the date backward (when pressing the prev button)
 */
export function prevDate(date, duration, hiddenDays) {
    subtractDuration(date, duration);
    if (hiddenDays.length && hiddenDays.length < 7) {
        while (hiddenDays.includes(date.getUTCDay())) {
            subtractDay(date);
        }
    }
    return date;
}

/**
 * For a given date, get its week number
 *  - ISO @see https://stackoverflow.com/questions/6117814/get-week-of-year-in-javascript-like-in-php
 *  - Western @see https://en.wikipedia.org/wiki/Week#Other_week_numbering_systems
 */
export function getWeekNumber(date, firstDay) {
    // Copy date so don't modify original
    date = cloneDate(date);
    if (firstDay == 0) {  // Western
        // Set to nearest Saturday: current date + 5 - current day number
        date.setUTCDate(date.getUTCDate() + 5 - date.getUTCDay());
    } else {  // ISO
        // Set to nearest Thursday: current date + 4 - current day number
        // Make Sunday's day number 7
        date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
    }
    // Get first day of year
    let yearStart = new Date(Date.UTC(date.getUTCFullYear(),0,1));
    // Calculate full weeks to `date`
    return Math.ceil((((date - yearStart) / 1000 / DAY_IN_SECONDS) + 1) / 7);
}

/**
 * Private functions
 */

function _fromLocalDate(date) {
    return new Date(Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds()
    ));
}

function _fromISOString(str) {
    const parts = str.match(/\d+/g);
    return new Date(Date.UTC(
        Number(parts[0]),
        Number(parts[1]) - 1,
        Number(parts[2]),
        Number(parts[3] || 0),
        Number(parts[4] || 0),
        Number(parts[5] || 0)
    ));
}
