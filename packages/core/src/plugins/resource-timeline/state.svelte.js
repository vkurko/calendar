import {TRRState} from '../time-grid/state.svelte.js';
import {RRState} from '../resource-time-grid/state.svelte.js';
import {daySlots, dayTimeLimits, eventChunks, grid, iEventChunks, monthView, nestedResources} from './derived.js';

export default class ViewState extends RRState(TRRState()) {
    constructor(mainState) {
        super(mainState);
        this.dayTimeLimits = $derived.by(dayTimeLimits(mainState));  // flexible time limits per day
        this.daySlots = $derived.by(daySlots(mainState, this));
        this.grid = $derived.by(grid(mainState, this));
        let {chunks, bgChunks} = $derived.by(eventChunks(mainState, this));
        this.chunks = $derived(chunks);
        this.bgChunks = $derived(bgChunks);
        this.iChunks = $derived.by(iEventChunks(mainState, this));
        this.monthView = $derived.by(monthView(mainState));
        this.nestedResources = $derived.by(nestedResources(mainState));
    }
}
