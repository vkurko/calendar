import {intl} from '#lib';
import {slots, slotLabelPeriodicity, slotTimeLimits, grid, eventChunks, iEventChunks, snap} from './derived.js';

/**
 * TimeGrid + ResourceTimeGrid + ResourceTimeline
 */
export function TRRState() {
    return class {
        constructor(mainState) {
            this.intlSlotLabel = $derived.by(intl(mainState, 'slotLabelFormat'));
            this.slotLabelPeriodicity = $derived.by(slotLabelPeriodicity(mainState));
            this.sidebarWidth = $state(0);
            this.snap = $derived.by(snap(mainState));
        }
    };
}

/**
 * TimeGrid + ResourceTimeGrid
 */
export function TRState(Base) {
    return class extends Base {
        constructor(mainState) {
            super(mainState);
            this.slotTimeLimits = $derived.by(slotTimeLimits(mainState));  // flexible limits
            this.slots = $derived.by(slots(mainState, this));
            let {chunks, bgChunks, allDayChunks, allDayBgChunks} = $derived.by(eventChunks(mainState, this));
            this.chunks = $derived(chunks);
            this.bgChunks = $derived(bgChunks);
            this.allDayChunks = $derived(allDayChunks);
            this.allDayBgChunks = $derived(allDayBgChunks);
            let {iChunks, allDayIChunks} = $derived.by(iEventChunks(mainState, this));
            this.iChunks = $derived(iChunks);
            this.allDayIChunks = $derived(allDayIChunks);
        }
    };
}

export default class ViewState extends TRState(TRRState()) {
    constructor(mainState) {
        super(mainState);
        this.grid = $derived.by(grid(mainState, this));
    }
}
