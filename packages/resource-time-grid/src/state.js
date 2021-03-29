import {State} from '@event-calendar/time-grid';
import {viewResources} from './stores';

export default class extends State {
    constructor(state) {
        super(state);

        this._viewResources = viewResources(state);
    }
}