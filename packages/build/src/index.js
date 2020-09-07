import Calendar from '@event-calendar/core';
import DayGrid from '@event-calendar/day-grid';
import List from '@event-calendar/list';
import TimeGrid from '@event-calendar/time-grid';
import ResourceTimeGrid from '@event-calendar/resource-time-grid';
import 'whatwg-fetch';
import 'abort-controller/polyfill';

export default class extends Calendar {
    constructor(el, options) {
        options.plugins = options.plugins || [DayGrid, List, TimeGrid, ResourceTimeGrid];

        super(el, options);
    }
}
