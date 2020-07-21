import {writable} from 'svelte/store';
import * as stores from './stores';

export default class {
    constructor(state) {
        this._slotTimes = stores.slotTimes(state._events, state._activeRange, state.slotMinTime, state.slotMaxTime, state.flexibleSlotTimeLimits);
        this._times = stores.times(state.slotDuration, this._slotTimes, state._intlSlotLabel);
        this._scrollable = writable(false);
    }
}