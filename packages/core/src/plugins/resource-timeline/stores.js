import {derived} from 'svelte/store';
import {createSlotTimeLimits, createSlots, getPayload, toSeconds} from '#lib';

// slotTimeLimits per day
export function dayTimeLimits(state) {
    return derived(
        [state.slotMinTime, state.slotMaxTime, state.flexibleSlotTimeLimits, state._viewDates, state._filteredEvents],
        ([$slotMinTime, $slotMaxTime, $flexibleSlotTimeLimits, $_viewDates, $_filteredEvents]) => {
            let dayTimeLimits = {};
            for (let date of $_viewDates) {
                dayTimeLimits[date.getTime()] = createSlotTimeLimits(
                    $slotMinTime,
                    $slotMaxTime,
                    $flexibleSlotTimeLimits,
                    [date],
                    $_filteredEvents
                );
            }

            return dayTimeLimits;
        }
    );
}

export function daySlots(state) {
    return derived(
        [state._viewDates, state.slotDuration, state._slotLabelPeriodicity, state._dayTimeLimits, state._intlSlotLabel],
        ([$_viewDates, $slotDuration, $_slotLabelPeriodicity, $_dayTimeLimits, $_intlSlotLabel]) => {
            let dayTimes = {};
            for (let date of $_viewDates) {
                let key = date.getTime();
                dayTimes[key] = key in $_dayTimeLimits
                    ? createSlots(date, $slotDuration, $_slotLabelPeriodicity, $_dayTimeLimits[key], $_intlSlotLabel)
                    : [];
            }

            return dayTimes;
        }
    );
}

export function nestedResources(state) {
    return derived(state.resources, $resources => $resources.some(resource => getPayload(resource).children.length));
}

export function monthView(state) {
    return derived(state.slotDuration, $slotDuration => !toSeconds($slotDuration));
}
