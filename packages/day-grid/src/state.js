import {days} from './stores';

export default class {
    constructor(state) {
        this._days = days(state);
    }
}