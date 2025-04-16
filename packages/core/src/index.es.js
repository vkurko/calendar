import {mount, unmount} from 'svelte';
import {Calendar} from './index.svelte.js';

export function createCalendar(target, plugins, options) {
    return mount(Calendar, {
        target,
        props: {
            plugins,
            options
        }
    });
}

export function destroyCalendar(calendar) {
    return unmount(calendar);
}

export {
    DayGrid,
    Interaction,
    List,
    ResourceTimeGrid,
    ResourceTimeline,
    TimeGrid
} from './index.svelte.js';
