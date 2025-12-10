import {derived} from 'svelte/store';

export function colsCount(state) {
    return derived(state.hiddenDays, $hiddenDays => 7 - $hiddenDays.length);
}
