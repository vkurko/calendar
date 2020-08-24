import {slotTimeLimits, times} from './stores';

export default class {
    constructor(state) {
        this._slotTimeLimits = slotTimeLimits(state);  // flexible limits
        this._times = times(state, this);
    }
}