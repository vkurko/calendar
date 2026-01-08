import {untrack} from 'svelte';
import {
    addDay, addDuration, bgEvent, cloneDate, createSlots, createSlotTimeLimits, datesEqual, getPayload, outsideRange,
    toSeconds
} from '#lib';
import {createChunks, prepareChunks} from './lib.js';

export function grid(mainState, viewState) {
    return () => {
        // Dependencies
        let {viewDates, options: {highlightedDates, validRange}} = mainState;
        let {dayTimeLimits, viewResources} = viewState;

        let grid = [];

        untrack(() => {
            let gridRow = 1
            for (let resource of viewResources) {
                let days = [];
                let gridColumn = 1;
                for (let date of viewDates) {
                    let slotTimeLimits = dayTimeLimits[date.getTime()];
                    days.push({
                        gridColumn,
                        gridRow,
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
                ++gridRow;
            }
        });

        return grid;
    };
}

export function eventChunks(mainState, viewState) {
    return () => {
        // Dependencies
        let {filteredEvents} = mainState;
        let {grid, monthView} = viewState;

        let chunks = [];
        let bgChunks = [];

        untrack(() => {
            for (let event of filteredEvents) {
                for (let days of grid) {
                    if (bgEvent(event.display)) {
                        if (!monthView || event.allDay) {
                            bgChunks = bgChunks.concat(createChunks(event, days, monthView));
                        }
                    } else {
                        chunks = chunks.concat(createChunks(event, days, monthView));
                    }
                }
            }
            prepareChunks(chunks);
        });

        return {chunks, bgChunks};
    };
}

export function iEventChunks(mainState, viewState) {
    return () => {
        // Dependencies
        let {iEvents} = mainState;
        let {grid, monthView} = viewState;

        let iChunks = [];

        for (let [, event] of iEvents) {
            if (!event) {
                continue;
            }
            untrack(() => {
                for (let days of grid) {
                    iChunks = iChunks.concat(createChunks(event, days, monthView, false));
                }
            });
        }

        return iChunks;
    };
}

// slotTimeLimits per day
export function dayTimeLimits(mainState) {
    return () => {
        // Dependencies
        let {filteredEvents, viewDates, options: {flexibleSlotTimeLimits, slotMinTime, slotMaxTime}} = mainState;

        let dayTimeLimits = {};

        untrack(() => {
            for (let date of viewDates) {
                dayTimeLimits[date.getTime()] = createSlotTimeLimits(
                    slotMinTime,
                    slotMaxTime,
                    flexibleSlotTimeLimits,
                    [date],
                    filteredEvents
                );
            }
        });

        return dayTimeLimits;
    };
}

export function daySlots(mainState, viewState) {
    return () => {
        // Dependencies
        let {viewDates, options: {slotDuration}} = mainState;
        let {dayTimeLimits, intlSlotLabel, slotLabelPeriodicity} = viewState;

        let slots = {};

        untrack(() => {
            for (let date of viewDates) {
                let key = date.getTime();
                slots[key] = key in dayTimeLimits
                    ? createSlots(date, slotDuration, slotLabelPeriodicity, dayTimeLimits[key], intlSlotLabel)
                    : [];
            }
        });

        return slots;
    };
}

export function nestedResources(mainState) {
    return () => {
        // Dependencies
        let {options: {resources}} = mainState;

        let nested;

        untrack(() => {
            nested = resources.some(resource => getPayload(resource).children.length);
        });

        return nested;
    };
}

export function monthView(mainState) {
    return () => {
        // Dependencies
        let {options: {slotDuration}} = mainState;

        let monthView;

        untrack(() => {
            monthView = !toSeconds(slotDuration);
        });

        return monthView;
    };
}
