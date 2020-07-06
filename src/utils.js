
export function createDate(source) {
    return source ? (source instanceof Date ? cloneDate(source) : new Date(source)) : new Date();
}

export function cloneDate(date) {
    return new Date(date.getTime());
}

export function createDuration(source) {
    let duration = {
        years: source.years || 0,
        months: source.months || 0,
        days: (source.weeks || 0) * 7 + (source.days || 0),
        seconds: (source.hours || 0) * 60 * 60 + (source.minutes || 0) * 60 + (source.seconds || 0),
        inWeeks: 'weeks' in source
    };
    if (!duration.seconds && !duration.days && !duration.months && !duration.years) {
        duration.seconds = 60 * 60;
    }
    return duration;
}

export function modifyDate(date, duration, multiplier) {
    multiplier = multiplier || 1;
    date.setFullYear(date.getFullYear() + multiplier * duration.years);
    date.setMonth(date.getMonth() + multiplier * duration.months);
    date.setDate(date.getDate() + multiplier * duration.days);
    date.setSeconds(date.getSeconds() + multiplier * duration.seconds);
}

export function assign(...args) {
    return Object.assign(...args);
}