import {run_all} from 'svelte/internal';

export function debounce(fn, handle, queueStore) {
    queueStore.update(queue => queue.set(handle, fn));
}

export function flushDebounce(queue) {
    run_all(queue);
    queue.clear();
}
