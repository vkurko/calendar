import {untrack} from 'svelte';
import {addDay, bgEvent, cloneDate, createAllDayChunks, datesEqual, outsideRange, prepareAllDayChunks} from '#lib';

export function colsCount(mainState) {
    return () => {
        // Dependencies
        let {options: {hiddenDays}} = mainState;

        let count;

        untrack(() => count = 7 - hiddenDays.length);

        return count;
    };
}

export function grid(mainState, viewState) {
    return () => {
        // Dependencies
        let {options: {highlightedDates, validRange}, viewDates} = mainState;
        let {colsCount} = viewState;

        let grid = [];

        untrack(() => {
            let days = [];
            let gridColumn = 1;
            let gridRow = 1;
            for (let date of viewDates) {
                days.push({
                    gridColumn,
                    gridRow,
                    resource: undefined,
                    dayStart: date,
                    dayEnd: addDay(cloneDate(date)),
                    disabled: outsideRange(date, validRange),
                    highlight: highlightedDates.some(d => datesEqual(d, date))
                });
                if (gridColumn === colsCount) {
                    grid.push(days);
                    days = [];
                    gridColumn = 0;
                    ++ gridRow;
                }
                ++ gridColumn;
            }
        });

        return grid;
    }
}

export function eventChunks(mainState, viewState) {
    return () => {
        // Dependencies
        let {filteredEvents} = mainState;
        let {grid} = viewState;

        let chunks = [];
        let bgChunks = [];

        untrack(() => {
            for (let event of filteredEvents) {
                for (let days of grid) {
                    if (bgEvent(event.display)) {
                        if (event.allDay) {
                            bgChunks = bgChunks.concat(createAllDayChunks(event, days));
                        }
                    } else {
                        chunks = chunks.concat(createAllDayChunks(event, days));
                    }
                }
            }
            prepareAllDayChunks(chunks);
        });

        return {chunks, bgChunks};
    };
}

export function iEventChunks(mainState, viewState) {
    return () => {
        // Dependencies
        let {iEvents} = mainState;
        let {grid} = viewState;

        let iChunks = [];

        for (let [, event] of iEvents) {
            if (!event) {
                continue;
            }
            untrack(() => {
                for (let days of grid) {
                    iChunks = iChunks.concat(createAllDayChunks(event, days));
                }
            });
        }

        return iChunks;
    };
}
