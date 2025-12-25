import {TRRState, TRState} from '../time-grid/state.svelte.js';
import {grid, viewResources} from './derived.js';

/**
 * ResourceTimeGrid + ResourceTimeline
 */
export function RRState(Base){
    return class extends Base {
        constructor(mainState) {
            super(mainState);
            this.viewResources = $derived.by(viewResources(mainState));
        }
    }
}

export default class ViewState extends RRState(TRState(TRRState())) {
    constructor(mainState) {
        super(mainState);
        this.grid = $derived.by(grid(mainState, this));
    }
}
