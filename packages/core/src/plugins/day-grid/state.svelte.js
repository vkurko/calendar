import {SvelteMap} from 'svelte/reactivity';
import {intl} from '#lib';
import {colsCount, eventChunks, grid, iEventChunks} from './derived.js';

export default class ViewState {
    constructor(mainState) {
        this.colsCount = $derived.by(colsCount(mainState));
        this.grid = $derived.by(grid(mainState, this));
        this.gridEl = $state();
        let {chunks, bgChunks} = $derived.by(eventChunks(mainState, this));
        this.chunks = $derived(chunks);
        this.bgChunks = $derived(bgChunks);
        this.iChunks = $derived.by(iEventChunks(mainState, this));
        this.hiddenChunks = new SvelteMap();
        this.intlDayCell = $derived.by(intl(mainState, 'dayCellFormat'));
        this.intlDayPopover = $derived.by(intl(mainState, 'dayPopoverFormat'));
        this.popupDay = $state(null);
    }
}
