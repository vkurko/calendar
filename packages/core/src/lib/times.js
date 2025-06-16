import {addDuration, cloneDate, createDuration, DAY_IN_SECONDS, toISOString, toSeconds} from './date.js';
import {max as maxFn, min as minFn, isFunction} from './utils.js';
import {bgEvent} from './events.js';

export function createTimes(date, $slotDuration, $slotLabelInterval, $_slotTimeLimits, $_intlSlotLabel) {
    date = cloneDate(date);
    let times = [];
    let end = cloneDate(date);
    addDuration(date, $_slotTimeLimits.min);
    addDuration(end, $_slotTimeLimits.max);
    // Labels
    if ($slotLabelInterval === undefined) {
        $slotLabelInterval = $slotDuration.seconds < 3600
            ? createDuration($slotDuration.seconds * 2)
            : $slotDuration;
    }
    let label = cloneDate(date);
    // Build times
    while (date < end) {
        times.push([
            toISOString(date),
            $_intlSlotLabel.format(date),
            date >= label
        ]);
        while ($slotLabelInterval.seconds && date >= label) {
            addDuration(label, $slotLabelInterval);
        }
        addDuration(date, $slotDuration);
    }

    return times;
}

export function createSlotTimeLimits($slotMinTime, $slotMaxTime, $flexibleSlotTimeLimits, $_viewDates, $_filteredEvents) {
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
