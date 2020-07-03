
export function createDate(source) {
    return source ? (source instanceof Date ? cloneDate(source) : new Date(source)) : new Date();
}

export function cloneDate(date) {
    return new Date(date.getTime());
}

export function modifyDate(date, duration) {
    date.setHours(date.getHours() + duration.hours);
    date.setMinutes(date.getMinutes() + duration.minutes);
}