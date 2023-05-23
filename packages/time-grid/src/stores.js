import {derived} from 'svelte/store';
import {
    DAY_IN_SECONDS,
    createDate,
    cloneDate,
    addDuration,
    createDuration,
    min as minFn, max as maxFn
} from '@event-calendar/core';

export function times(state, localState) {
    return derived(
        [localState._slotTimeLimits, state._intlSlotLabel, state.slotDuration],
        ([$_slotTimeLimits, $_intlSlotLabel, $slotDuration]) => {
            let compact = $slotDuration.seconds >= 3600;
            let times = [];
            let date = createDate('2020-01-01');
            let end = cloneDate(date);
            let i = 1;
            addDuration(date, $_slotTimeLimits.min);
            addDuration(end, $_slotTimeLimits.max);
            while (date < end) {
                times.push(times.length && (i || compact) ? $_intlSlotLabel.format(date) : '');
                addDuration(date, $slotDuration);
                i = 1 - i;
            }

            return times;
        }
    );
}

export function slotTimeLimits(state) {
    return derived(
        [state._events, state._viewDates, state.flexibleSlotTimeLimits, state.slotMinTime, state.slotMaxTime],
        ([$_events, $_viewDates, $flexibleSlotTimeLimits, $slotMinTime, $slotMaxTime]) => {
            let min = createDuration($slotMinTime);
            let max = createDuration($slotMaxTime);

            if ($flexibleSlotTimeLimits) {
                let minMin = createDuration(minFn(min.seconds, maxFn(0, max.seconds - DAY_IN_SECONDS)));
                let maxMax = createDuration(maxFn(max.seconds, minMin.seconds + DAY_IN_SECONDS));
                loop: for (let date of $_viewDates) {
                    let start = addDuration(cloneDate(date), min);
                    let end = addDuration(cloneDate(date), max);
                    let minStart = addDuration(cloneDate(date), minMin);
                    let maxEnd = addDuration(cloneDate(date), maxMax);
                    for (let event of $_events) {
                        if (event.display === 'auto' && event.start < maxEnd && event.end > minStart) {
                            if (event.start < start) {
                                let seconds = maxFn((event.start - date) / 1000, minMin.seconds);
                                if (seconds < min.seconds) {
                                    min.seconds = seconds;
                                }
                            }
                            if (event.end > end) {
                                let seconds = minFn((event.end - date) / 1000, maxMax.seconds);
                                if (seconds > max.seconds) {
                                    max.seconds = seconds;
                                }
                            }
                            if (min.seconds === minMin.seconds && max.seconds === maxMax.seconds) {
                                break loop;
                            }
                        }
                    }
                }
            }

            return {min, max};
        }
    );
}