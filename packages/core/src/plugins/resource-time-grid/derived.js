import {untrack} from 'svelte';
import {
    addDay, addDuration, bgEvent, cloneDate, createResources, datesEqual, eventIntersects, outsideRange, toTime, uid
} from '#lib';

// Placeholder resource for views with no resources, created once to keep its identity stable
let placeholderResources;

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
                result = placeholderResources ??= createResources([{}]);
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
            let loop = [viewResources, viewDates];
            let keys = [uid, toTime];
            if (datesAboveResources) {
                loop.reverse();
                keys.reverse();
            }
            for (let item0 of loop[0]) {
                let days = [];
                // Keys identify the items the grid is built from, for use in keyed `each` blocks
                let groupKey = keys[0](item0);
                for (let item1 of loop[1]) {
                    let date = datesAboveResources ? item0 : item1;
                    let resource =  datesAboveResources ? item1 : item0;
                    days.push({
                        gridColumn,
                        gridRow: 1,
                        resource,
                        key: keys[1](item1),
                        groupKey,
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
