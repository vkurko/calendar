import {derived} from 'svelte/store';
import {createDate, cloneDate, addDay, subtractDay, addDuration, createDuration} from '../../lib/date';

export function times(slotDuration, _slotTimes, _intlSlotLabel) {
    return derived(
        [slotDuration, _slotTimes, _intlSlotLabel],
        ([$slotDuration, $_slotTimes, $_intlSlotLabel]) => {
            let compact = $slotDuration.seconds >= 3600;
            let times = [];
            let date = createDate('2020-01-01 00:00:00');
            let end = cloneDate(date);
            let i = 1;
            addDuration(date, $_slotTimes.min);
            addDuration(end, $_slotTimes.max);
            while (date < end) {
                times.push(times.length && (i || compact) ? $_intlSlotLabel.format(date) : '');
                addDuration(date, $slotDuration);
                i = 1 - i;
            }

            return times;
        }
    );
}

export function slotTimes(_events, _activeRange, slotMinTime, slotMaxTime, flexibleSlotTimeLimits) {
    return derived(
        [_events, _activeRange, slotMinTime, slotMaxTime, flexibleSlotTimeLimits],
        ([$_events, $_activeRange, $slotMinTime, $slotMaxTime, $flexibleSlotTimeLimits]) => {
            let min = $slotMinTime;
            let max = $slotMaxTime;
            if ($flexibleSlotTimeLimits) {
                let testRange = [addDay(cloneDate($_activeRange.start)), subtractDay(cloneDate($_activeRange.end))];
                for (let event of $_events) {
                    if (event.display === 'auto' && event.start < $_activeRange.end && event.end > $_activeRange.start) {
                        let start = createDuration(event.start);
                        let end = createDuration(event.end);
                        if (event.start.getDate() !== event.end.getDate()) {
                            if (event.end <= $_activeRange.end || event.start < testRange[1]) {
                                start.seconds = 0;
                            }
                            if (event.start >= $_activeRange.start || event.end >= testRange[0]) {
                                end.seconds = 86400;
                            }
                        }
                        if (start.seconds < min.seconds) {
                            min = start;
                        }
                        if (end.seconds > max.seconds) {
                            max = end;
                        }
                    }
                }
            }
            return {min, max};
        }
    );
}