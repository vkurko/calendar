import {addDay, bgEvent, cloneDate, createAllDayChunks, datesEqual, outsideRange, prepareAllDayChunks} from '#lib';

export function createGrid($_viewDates, $_colsCount, $validRange, $highlightedDates) {
    let grid = [];
    let days = [];
    let gridColumn = 1;
    let gridRow = 1;
    for (let date of $_viewDates) {
        days.push({
            gridColumn,
            gridRow,
            resource: undefined,
            dayStart: date,
            dayEnd: addDay(cloneDate(date)),
            disabled: outsideRange(date, $validRange),
            highlight: $highlightedDates.some(d => datesEqual(d, date))
        });
        if (gridColumn === $_colsCount) {
            grid.push(days);
            days = [];
            gridColumn = 0;
            ++ gridRow;
        }
        ++ gridColumn;
    }

    return grid;
}

export function createEventChunks($_filteredEvents, grid) {
    let chunks = [];
    let bgChunks = [];
    for (let event of $_filteredEvents) {
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

    return {chunks, bgChunks};
}

export function createIEventChunks($_iEvents, grid) {
    let iChunks = [];
    for (let event of $_iEvents) {
        if (!event) {
            continue;
        }
        for (let days of grid) {
            iChunks = iChunks.concat(createAllDayChunks(event, days));
        }
    }

    return iChunks;
}