import * as stores from './stores';

export default class {
    constructor(state) {
        this._days = stores.days(state.date, state.firstDay);
    }
}