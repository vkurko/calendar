import {addDuration, cloneDate, createDuration, DAY_IN_SECONDS, toISOString, toSeconds} from './date.js';
import {max as maxFn, min as minFn, isFunction, floor} from './utils.js';
import {bgEvent} from './events.js';

export function createSlots(date, $slotDuration, $_slotLabelPeriodicity, $_slotTimeLimits, $_intlSlotLabel) {
    let slots = [];
    date = cloneDate(date);
    let end = cloneDate(date);
    addDuration(date, $_slotTimeLimits.min);
    addDuration(end, $_slotTimeLimits.max);
    // Build slots
    while (date < end) {
        slots.push([
            toISOString(date),
            $_intlSlotLabel.format(date)
        ]);
        addDuration(date, $slotDuration, $_slotLabelPeriodicity);
    }
    // Calculate span for last slot
    let span = floor((date - end) / 1000 / toSeconds($slotDuration));
    if (span && span !== $_slotLabelPeriodicity) {
        slots.at(-1)[2] = $_slotLabelPeriodicity - span;
    }

    return slots;
}

export function createSlotTimeLimits($slotMinTime, $slotMaxTime, $flexibleSlotTimeLimits, $_viewDates, $_filteredEvents) {
    // Copy values
    let min = createDuration($slotMinTime);
    let max = createDuration($slotMaxTime);

    if ($flexibleSlotTimeLimits) {
        // If slotMaxTime goes past midnight, then extend it back by a maximum of 24 hours
        let minMin = createDuration(minFn(toSeconds(min), maxFn(0, toSeconds(max) - DAY_IN_SECONDS)));
        let maxMax = createDuration(maxFn(toSeconds(max), toSeconds(minMin) + DAY_IN_SECONDS));
        let filter = isFunction($flexibleSlotTimeLimits?.eventFilter)
            ? $flexibleSlotTimeLimits.eventFilter
            : event => !bgEvent(event.display);
        loop: for (let date of $_viewDates) {
            let start = addDuration(cloneDate(date), min);
            let end = addDuration(cloneDate(date), max);
            let minStart = addDuration(cloneDate(date), minMin);
            let maxEnd = addDuration(cloneDate(date), maxMax);
            for (let event of $_filteredEvents) {
                if (!event.allDay && filter(event) && event.start < maxEnd && event.end > minStart) {
                    if (event.start < start) {
                        let seconds = maxFn((event.start - date) / 1000, toSeconds(minMin));
                        if (seconds < toSeconds(min)) {
                            min.seconds = seconds;
                        }
                    }
                    if (event.end > end) {
                        let seconds = minFn((event.end - date) / 1000, toSeconds(maxMax));
                        if (seconds > toSeconds(max)) {
                            max.seconds = seconds;
                        }
                    }
                    if (toSeconds(min) === toSeconds(minMin) && toSeconds(max) === toSeconds(maxMax)) {
                        break loop;
                    }
                }
            }
        }
    }

    return {min, max};
}
