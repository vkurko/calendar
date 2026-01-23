import {untrack} from 'svelte';
import {
    addDay, addDuration, bgEvent, cloneDate, createResources, datesEqual, eventIntersects, outsideRange
} from '#lib';

export function viewResources(mainState) {
    return () => {
        // Dependencies
        let {
            activeRange, filteredEvents, resources, options: {filterResourcesWithEvents}, extensions: {viewResources}
        } = mainState;

        let result = viewResources ? viewResources(resources) : resources;

        untrack(() => {
            if (filterResourcesWithEvents) {
                result = resources.filter(
                    resource => filteredEvents.some(
                        event => !bgEvent(event.display) && eventIntersects(event, activeRange.start, activeRange.end, resource)
                    )
                );
            }
            if (!result.length) {
                result = createResources([{}]);
            }
        });

        return result;
    };
}

export function grid(mainState, viewState) {
    return () => {
        // Dependencies
        let {viewDates, options: {datesAboveResources, highlightedDates, validRange}} = mainState;
        let {slotTimeLimits, viewResources} = viewState;

        let grid = [];

        untrack(() => {
            let gridColumn = 1;
            let loop = datesAboveResources ? [viewDates, viewResources] : [viewResources, viewDates];
            for (let item0 of loop[0]) {
                let days = [];
                for (let item1 of loop[1]) {
                    let date = datesAboveResources ? item0 : item1;
                    let resource =  datesAboveResources ? item1 : item0;
                    days.push({
                        gridColumn,
                        gridRow: 1,
                        resource,
                        start: addDuration(cloneDate(date), slotTimeLimits.min),
                        end: addDuration(cloneDate(date), slotTimeLimits.max),
                        dayStart: date,
                        dayEnd: addDay(cloneDate(date)),
                        disabled: outsideRange(date, validRange),
                        highlight: highlightedDates.some(d => datesEqual(d, date))
                    });
                    ++gridColumn;
                }
                grid.push(days);
            }
        });

        return grid;
    };
}
