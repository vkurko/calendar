import {days} from './stores';
import {writable} from 'svelte/store';

export default class {
    constructor(state) {
        this._days = days(state);
        this._hiddenEvents = writable({});
        this._popup = writable({
            date: null,
            chunks: []
        });
    }
}