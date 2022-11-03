import {days} from './stores';
import {writable} from 'svelte/store';

export default class {
    constructor(state) {
        this._days = days(state);
        this._hiddenEvents = writable({});
        this._popupDate = writable(null);
        this._popupChunks = writable([]);
    }
}