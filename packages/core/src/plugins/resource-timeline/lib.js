import {
    addDay, addDuration, assign, bgEvent, cloneDate, createDuration, createEventChunk, datesEqual, eventIntersects, max,
    min, outsideRange
} from '#lib';

export function createGrid($_viewDates, $_viewResources, $_dayTimeLimits, $validRange, $highlightedDates) {
    let grid = [];
    let gridRow = 1
    for (let resource of $_viewResources) {
        let days = [];
        let gridColumn = 1;
        for (let date of $_viewDates) {
            let slotTimeLimits = $_dayTimeLimits[date.getTime()];
            days.push({
                gridColumn,
                gridRow,
                resource,
                start: addDuration(cloneDate(date), slotTimeLimits.min),
                end: addDuration(cloneDate(date), slotTimeLimits.max),
                dayStart: date,
                dayEnd: addDay(cloneDate(date)),
                disabled: outsideRange(date, $validRange),
                highlight: $highlightedDates.some(d => datesEqual(d, date))
            });
            ++ gridColumn;
        }
        grid.push(days);
        ++ gridRow;
    }
    return grid;
}

export function createEventChunks($_filteredEvents, grid) {
    let chunks = [];
    let bgChunks = [];
    for (let event of $_filteredEvents) {
        for (let days of grid) {
            if (bgEvent(event.display)) {
                bgChunks = bgChunks.concat(createChunks(event, days));
            } else {
                chunks = chunks.concat(createChunks(event, days));
            }
        }
    }
    prepareChunks(chunks);

    return {chunks, bgChunks};
}

export function createIEventChunks($_iEvents, grid) {
    let iChunks = [];
    for (let event of $_iEvents) {
        if (!event) {
            continue;
        }
        for (let days of grid) {
            iChunks = iChunks.concat(createChunks(event, days));
        }
    }

    return iChunks;
}

function createChunks(event, days) {
    let dates = [];
    let firstStart;
    let lastEnd;
    let gridColumn;
    let gridRow;
    let left;
    let width = 0;
    for (let {gridColumn: column, gridRow: row, resource, dayStart, start, end, disabled} of days) {
        if (!disabled && eventIntersects(event, start, end, resource)) {
            if (!dates.length) {
                firstStart = start;
                gridColumn = column;
                gridRow = row;
                left = max(event.start - start, 0) / 1000;
            }
            dates.push(dayStart);
            lastEnd = end;
            width += (min(end, event.end) - max(start, event.start)) / 1000;
        }
    }
    if (dates.length) {
        let chunk = createEventChunk(event, firstStart, lastEnd);
        // Chunk layout
        assign(chunk, {gridColumn, gridRow, dates, left, width});

        return [chunk];
    }

    return [];
}

export function prepareChunks(chunks) {
    let dayChunks = {};
    for (let chunk of chunks) {
        let {gridColumn, gridRow} = chunk;
        // Prepare day chunks
        for (let i = 0; i < chunk.dates.length; ++ i) {
            let key = `${gridRow}_${gridColumn + i}`;
            if (dayChunks[key]) {
                dayChunks[key].push(chunk);
            } else {
                dayChunks[key] = [chunk];
            }
        }
        let key = `${gridRow}_${gridColumn}`;
        chunk.day = dayChunks[key];
    }
}

export function repositionEvent(chunk, height, monthView) {
    let top = 1;
    let bottom = top + height;
    let dayChunks = chunk.day;
    dayChunks.sort((a, b) => (a.top ?? Number.POSITIVE_INFINITY) - (b.top ?? Number.POSITIVE_INFINITY));
    for (let dayChunk of dayChunks) {
        if (dayChunk === chunk || !('top' in dayChunk)) {
            continue;
        }
        if ((monthView || chunk.start < dayChunk.end && chunk.end > dayChunk.start) && top < dayChunk.bottom && bottom > dayChunk.top) {
            let offset = dayChunk.bottom - top + 1;
            top += offset;
            bottom += offset;
        }
    }
    assign(chunk, {top, bottom});

    return top;
}

export function getSlotTimeLimits($_dayTimeLimits, date) {
    return $_dayTimeLimits[date.getTime()] ?? {min: createDuration(0), max: createDuration('24:00:00')};
}
