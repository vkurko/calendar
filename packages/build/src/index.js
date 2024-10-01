import Calendar from '@event-calendar/core';
import DayGrid from '@event-calendar/day-grid';
import List from '@event-calendar/list';
import TimeGrid from '@event-calendar/time-grid';
import ResourceTimeGrid from '@event-calendar/resource-time-grid';
import ResourceTimeline from '@event-calendar/resource-timeline';
import Interaction from '@event-calendar/interaction';
import '@event-calendar/core/index.css';

export default class extends Calendar {
    constructor(el, options) {
        super({
            target: el,
            props: {
                plugins: [DayGrid, List, TimeGrid, ResourceTimeGrid, ResourceTimeline, Interaction],
                options
            }
        });
    }
}
