import * as stores from './stores';

export default class {
    constructor(state) {
        this._slotTimeLimits = stores.slotTimeLimits(state.slotMinTime, state.slotMaxTime, state.flexibleSlotTimeLimits, state._events, state._activeRange);
        this._times = stores.times(state.slotDuration, this._slotTimeLimits, state._intlSlotLabel);
    }
}