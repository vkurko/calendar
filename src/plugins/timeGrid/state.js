import {writable} from 'svelte/store';
import * as stores from './stores';

export default class {
    constructor(state) {
        this.times = stores.times(state.slotDuration, state._intlSlotLabel);
        this.scrollable = writable(false);
    }
}