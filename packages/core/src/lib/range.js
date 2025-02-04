import {createDate, setMidnight} from './date.js';

export function createDateRange(input) {
    let start, end;
    if (input) {
        ({start, end} = input);
        if (start) {
            start = setMidnight(createDate(start));
        }
        if (end) {
            end = setMidnight(createDate(end));
        }
    }
    return {start, end};
}

export function outsideRange(date, range) {
    return range.start && date < range.start || range.end && date > range.end;
}

export function limitToRange(date, range) {
    if (range.start && date < range.start) {
        date = range.start;
    }
    if (range.end && date > range.end) {
        date = range.end;
    }
    return date;
}
