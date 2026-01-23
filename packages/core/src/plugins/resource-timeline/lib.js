import {assign, assignChunkId, createDuration, createEventChunk, eventIntersects, max, min} from '#lib';

export function createChunks(event, days, monthView, withId = true) {
    let dates = [];
    let firstStart;
    let lastEnd;
    let gridColumn;
    let gridRow;
    let resource;
    let left;
    let width = 0;
    for (let {gridColumn: column, gridRow: row, resource: dayResource, dayStart, dayEnd, start, end, disabled} of days) {
        if (!disabled) {
            if (monthView) {
                if (eventIntersects(event, dayStart, dayEnd, dayResource)) {
                    if (!dates.length) {
                        firstStart = dayStart;
                        gridColumn = column;
                        gridRow = row;
                        resource = dayResource;
                    }
                    dates.push(dayStart);
                    lastEnd = end;
                }
            } else {
                if (eventIntersects(event, start, end, dayResource)) {
                    if (!dates.length) {
                        firstStart = start;
                        gridColumn = column;
                        gridRow = row;
                        resource = dayResource;
                        left = max(event.start - start, 0) / 1000;
                    }
                    dates.push(dayStart);
                    lastEnd = end;
                    width += (min(end, event.end) - max(start, event.start)) / 1000;
                }
            }
        }
    }
    if (dates.length) {
        let chunk = createEventChunk(event, firstStart, lastEnd);
        // Chunk layout
        assign(chunk, {gridColumn, gridRow, resource, dates, left, width});
        if (withId) {
            assignChunkId(chunk);
        }

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

export function getSlotTimeLimits(dayTimeLimits, date) {
    return dayTimeLimits[date.getTime()] ?? {min: createDuration(0), max: createDuration('24:00:00')};
}
