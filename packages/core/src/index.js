import Calendar from './Calendar.svelte';

export default class extends Calendar {
    destroy() {
        this.$destroy();
    }

    get view() {
        return this.getView();
    }
}

export * from './lib.js';
