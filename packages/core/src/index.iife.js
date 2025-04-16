import {createCalendar, DayGrid, Interaction, List, ResourceTimeGrid, ResourceTimeline, TimeGrid} from './index.es.js';

export function create(target, options) {
    return createCalendar(target, [
        DayGrid,
        Interaction,
        List,
        ResourceTimeGrid,
        ResourceTimeline,
        TimeGrid
    ], options);
}

export {destroyCalendar as destroy} from './index.es.js';
