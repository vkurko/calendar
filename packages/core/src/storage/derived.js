import {untrack} from 'svelte';
import {
    addDay, addDuration, cloneDate, createView, isFunction, prevClosestDay, subtractDay,
    toEventWithLocalDates, toViewWithLocalDates
} from '#lib';

export function currentRange(mainState) {
    return () => {
        // Dependencies
        let {options: {date, duration, firstDay}} = mainState;

        let start, end;

        untrack(() => {
            start = cloneDate(date);
            if (duration.months) {
                start.setUTCDate(1);
            } else if (duration.inWeeks) {
                // First day of week
                prevClosestDay(start, firstDay);
            }
            end = addDuration(cloneDate(start), duration);
        });

        return {start, end};
    };
}

export function activeRange(mainState) {
    return () => {
        // Dependencies
        let {currentRange, extensions: {activeRange}} = mainState;

        let start, end;

        untrack(() => {
            start = cloneDate(currentRange.start);
            end = cloneDate(currentRange.end);
        });

        return activeRange ? activeRange(start, end) : {start, end};
    };
}

export function filteredEvents(mainState) {
    return () => {
        // Dependencies
        let {events, options: {eventFilter, eventOrder, filterEventsWithResources, resources}} = mainState;

        let result = [...events];

        untrack(() => {
            // Filter events
            if (isFunction(eventFilter)) {
                let events2 = events.map(toEventWithLocalDates);
                let view = toViewWithLocalDates(mainState.view);
                result = result
                    .filter((event, index) => eventFilter({
                        event: toEventWithLocalDates(event),
                        index,
                        events: events2,
                        view
                    }));
            }
            if (filterEventsWithResources) {
                result = result.filter(event => resources.some(resource => event.resourceIds.includes(resource.id)));
            }

            // Sort events
            if (isFunction(eventOrder)) {
                result.sort((a, b) => eventOrder(
                    toEventWithLocalDates(a),
                    toEventWithLocalDates(b)
                ));
            } else {
                // Sort by start date (all-day events always on top)
                result.sort((a, b) => a.start - b.start || b.allDay - a.allDay);
            }
        });

        return result;
    };
}

export function viewDates(mainState) {
    return () => {
        // Dependencies
        let {options, activeRange} = mainState;
        let {hiddenDays} = options;

        let dates = [];

        untrack(() => {
            let date = cloneDate(activeRange.start);
            let end = cloneDate(activeRange.end);
            while (date < end) {
                if (!hiddenDays.includes(date.getUTCDay())) {
                    dates.push(cloneDate(date));
                }
                addDay(date);
            }
            if (!dates.length && hiddenDays.length && hiddenDays.length < 7) {
                // Try to move the date
                while (hiddenDays.includes(options.date.getUTCDay())) {
                    mainState.setOption('date', addDay(cloneDate(options.date)));
                }
            }
        });

        return dates;
    };
}

export function viewTitle(mainState) {
    return () => {
        // Dependencies
        let {currentRange, intlTitle} = mainState;

        let title;

        untrack(() => {
            title = intlTitle.formatRange(currentRange.start, subtractDay(cloneDate(currentRange.end)));
        });

        return title;
    }
}

export function view(mainState) {
    return () => {
        // Dependencies
        let {activeRange, currentRange, viewTitle, options: {view}} = mainState;

        let viewObj;

        untrack(() => {
            viewObj = createView(view, viewTitle, currentRange, activeRange);
        });

        return viewObj;
    };
}
