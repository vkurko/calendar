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
                    lastEnd = dayEnd;
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

export function prepareChunks(chunks, strict) {
    let dayChunks = {};
    for (let i = 0; i < chunks.length; ++i) {
        let chunk = chunks[i];
        let {gridColumn, gridRow} = chunk;
        // Remember the processing order (eventOrder) for strict layout
        chunk.order = i;
        // Prepare day chunks
        for (let j = 0; j < chunk.dates.length; ++ j) {
            let key = `${gridRow}_${gridColumn + j}`;
            if (dayChunks[key]) {
                dayChunks[key].push(chunk);
            } else {
                dayChunks[key] = [chunk];
            }
        }
        let key = `${gridRow}_${gridColumn}`;
        chunk.day = dayChunks[key];
    }
    if (strict) {
        // Collect, for each chunk, all chunks sharing at least one of its columns.
        // Unlike `chunk.day` (which covers only the starting cell), this spans the
        // whole chunk, so a chunk can't float above an earlier-ordered chunk that
        // overlaps it in a column other than the first one.
        for (let chunk of chunks) {
            let {gridColumn, gridRow} = chunk;
            let seen = new Set([chunk]);
            let group = [];
            for (let j = 0; j < chunk.dates.length; ++ j) {
                for (let other of dayChunks[`${gridRow}_${gridColumn + j}`]) {
                    if (!seen.has(other)) {
                        seen.add(other);
                        group.push(other);
                    }
                }
            }
            chunk.group = group;
        }
    }
}

export function repositionEvent(chunk, height, monthView, gap = 1, strict = false) {
    let top = 1;
    let bottom = top + height;
    if (strict) {
        // Strictly follow eventOrder: place the chunk below every already-positioned
        // chunk that comes earlier in the order and shares a column with it. Chunks
        // sharing a column always overlap in time there, so they can't share a row.
        for (let other of chunk.group) {
            if (other.order < chunk.order && 'top' in other && other.bottom + gap > top) {
                top = other.bottom + gap;
            }
        }
        bottom = top + height;
    } else {
        let dayChunks = chunk.day;
        dayChunks.sort((a, b) => (a.top ?? Number.POSITIVE_INFINITY) - (b.top ?? Number.POSITIVE_INFINITY));
        for (let dayChunk of dayChunks) {
            if (dayChunk === chunk || !('top' in dayChunk)) {
                continue;
            }
            if ((monthView || chunk.start < dayChunk.end && chunk.end > dayChunk.start) && top < dayChunk.bottom && bottom > dayChunk.top) {
                let offset = dayChunk.bottom - top + gap;
                top += offset;
                bottom += offset;
            }
        }
    }
    assign(chunk, {top, bottom});

    return top;
}

export function getSlotTimeLimits(dayTimeLimits, date) {
    return dayTimeLimits[date.getTime()] ?? {min: createDuration(0), max: createDuration('24:00:00')};
}
