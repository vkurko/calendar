import {derived} from 'svelte/store';
import {createDate, createSlotTimeLimits, createTimes, setMidnight} from '@event-calendar/core';

export function times(state) {
    return derived(
        [state.slotDuration, state.slotLabelInterval, state._slotTimeLimits, state._intlSlotLabel],
        args => createTimes(setMidnight(createDate()), ...args)
    );
}

export function slotTimeLimits(state) {
    return derived(
        [state.slotMinTime, state.slotMaxTime, state.flexibleSlotTimeLimits, state._viewDates, state._events],
        args => createSlotTimeLimits(...args)
    );
}
