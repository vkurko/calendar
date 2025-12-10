import {derived, writable} from 'svelte/store';
import {ceil, createDate, createSlotTimeLimits, createSlots, intl, setMidnight, toSeconds} from '#lib';

function slotTimeLimits(state) {
    return derived(
        [state.slotMinTime, state.slotMaxTime, state.flexibleSlotTimeLimits, state._viewDates, state._filteredEvents],
        args => createSlotTimeLimits(...args)
    );
}

function slotLabelPeriodicity(state) {
    return derived(
        [state.slotDuration, state.slotLabelInterval],
        ([$slotDuration, $slotLabelInterval]) => {
            if ($slotLabelInterval === undefined) {
                return toSeconds($slotDuration) < 3600 ? 2 : 1;
            }
            return ceil(toSeconds($slotLabelInterval) / toSeconds($slotDuration)) || 1;
        }
    );
}

function slots(state) {
    return derived(
        [state.slotDuration, state._slotLabelPeriodicity, state._slotTimeLimits, state._intlSlotLabel],
        args => createSlots(setMidnight(createDate()), ...args)
    );
}

/**
 * TimeGrid + ResourceTimeGrid + ResourceTimeline
 */
export function createTRRStores(state) {
    if (!('_sidebarWidth' in state)) {
        state._intlSlotLabel = intl(state.locale, state.slotLabelFormat);
        state._slotLabelPeriodicity = slotLabelPeriodicity(state);
        state._sidebarWidth = writable(0);
    }
}

/**
 * TimeGrid + ResourceTimeGrid
 */
export function createTRStores(state) {
    if (!('_slots' in state)) {
        state._slotTimeLimits = slotTimeLimits(state);  // flexible limits
        state._slots = slots(state);
    }
}
