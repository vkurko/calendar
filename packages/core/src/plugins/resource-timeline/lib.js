import {assign, assignChunkId, createDuration, createEventChunk, eventIntersects, max, min, toTime} from '#lib';

/**
 * Find the index of the first day that can intersect with the event.
 * Days are ordered, so the range of days the event can occupy is contiguous.
 */
function firstDayIndex(event, days) {
    // Binary search for the first day ending after the event starts
    let low = 0;
    let high = days.length;
    while (low < high) {
        let mid = (low + high) >> 1;
        if (days[mid].dayEnd > event.start) {
            high = mid;
        } else {
            low = mid + 1;
        }
    }
    // A day may extend past midnight (slotMaxTime over 24 hours), so step back while it does
    while (low > 0 && days[low - 1].end > event.start) {
        --low;
    }

    return low;
}

export function createChunks(event, days, monthView, withId = true) {
    let dates = [];
    let firstStart;
    let lastEnd;
    let gridColumn;
    let gridRow;
    let resource;
    let left;
    let width = 0;
    for (let i = firstDayIndex(event, days); i < days.length; ++i) {
        let {gridColumn: column, gridRow: row, resource: dayResource, dayStart, dayEnd, start, end, disabled} = days[i];
        if (dayStart >= event.end) {
            // Days are ordered, so no day after this one can intersect either
            break;
        }
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

        return chunk;
    }

    return null;
}

/**
 * Check whether the event can have chunks in the given grid row
 */
export function eventInRow(event, days) {
    let resource = days[0]?.resource;
    return !resource || event.resourceIds.includes(resource.id);
}

export function prepareChunks(chunks, strict) {
    let dayChunks = {};
    for (let i = 0; i < chunks.length; ++i) {
        let chunk = chunks[i];
        let {gridColumn, gridRow} = chunk;
        // Remember the processing order (eventOrder) for strict layout
        chunk.order = i;
        // Prepare day chunks
        let cells = [];
        for (let j = 0; j < chunk.dates.length; ++ j) {
            let key = `${gridRow}_${gridColumn + j}`;
            let cell = dayChunks[key] ??= {pass: 0, placed: [], chunks: []};
            cell.chunks.push(chunk);
            cells.push(cell);
        }
        chunk.cells = cells;
    }
    if (strict) {
        // Collect, for each chunk, its `rivals` — all chunks sharing at least one of its columns,
        // and thus competing with it for a place. Unlike the non-strict layout (which looks only at the
        // starting cell), this spans the whole chunk, so a chunk can't float above an
        // earlier-ordered chunk that overlaps it in a column other than the first one.
        let layoutGroups = {};
        for (let chunk of chunks) {
            let {gridColumn, gridRow} = chunk;
            let seen = new Set([chunk]);
            let rivals = [];
            for (let j = 0; j < chunk.dates.length; ++ j) {
                for (let other of dayChunks[`${gridRow}_${gridColumn + j}`].chunks) {
                    if (!seen.has(other)) {
                        seen.add(other);
                        rivals.push(other);
                    }
                }
            }
            chunk.rivals = rivals;
            // `mates` are the chunks of the same layoutGroup within the same resource row. They are
            // laid out as a unit. The array is shared between the mates and lists them in the
            // eventOrder order, so `mates[0]` is the one positioned first — their anchor
            let {layoutGroup} = chunk.event;
            if (layoutGroup !== undefined) {
                chunk.mates = layoutGroups[`${gridRow}_${layoutGroup}`] ??= [];
                chunk.mates.push(chunk);
            }
        }
    }
}

/**
 * Check whether the chunk fits the given line without touching the chunks that have to keep their
 * place: the ones in its columns that come earlier in the order. Later-ordered chunks give way,
 * and they do have a position here, as the layout is run more than once
 */
function lineIsFree(chunk, line, height, gap) {
    for (let other of chunk.rivals) {
        if (
            other.order < chunk.order && 'top' in other &&
            line < other.bottom + gap && line + height + gap > other.top
        ) {
            return false;
        }
    }

    return true;
}

/**
 * Chunks already positioned in the cell during the current pass, ordered by top
 */
function placedIn(cell, pass) {
    if (cell.pass !== pass) {
        cell.pass = pass;
        cell.placed = [];
    }
    return cell.placed;
}

export function repositionEvent(chunk, height, monthView, gap = 1, strict = false, pass = 0) {
    let top = 1;
    let bottom = top + height;
    if (strict) {
        // Strictly follow eventOrder: place the chunk below every already-positioned
        // chunk that comes earlier in the order and shares a column with it. Chunks
        // sharing a column always overlap in time there, so they can't share a row.

        // The anchor is the mate positioned first, and it picks the line for all of them, so it
        // has to clear the way for every mate, not just for itself. The rest are positioned
        // against their own columns only: repeating the joint calculation would push each of them
        // lower than the anchor, since more chunks come earlier in the order for them
        let anchor = chunk.mates?.[0];
        for (let {rivals} of anchor === chunk ? chunk.mates : [chunk]) {
            for (let other of rivals) {
                if (other.order < chunk.order && 'top' in other && other.bottom + gap > top) {
                    top = other.bottom + gap;
                }
            }
        }
        bottom = top + height;
        if (anchor && anchor !== chunk) {
            // Join the line of the anchor, as long as it is free in the columns of this chunk.
            // A line above is out of reach, as it is taken by an earlier-ordered chunk
            let line = anchor.top;
            if (line > top && lineIsFree(chunk, line, height, gap)) {
                top = line;
                bottom = top + height;
            }
        }
    } else {
        // Walk the chunks already placed in the starting cell, which are kept ordered by top
        for (let other of placedIn(chunk.cells[0], pass)) {
            if (other.top >= bottom) {
                // The rest is below the chunk, so it can't be pushed down any further
                break;
            }
            if ((monthView || chunk.start < other.end && chunk.end > other.start) && top < other.bottom) {
                let offset = other.bottom - top + gap;
                top += offset;
                bottom += offset;
            }
        }
    }
    assign(chunk, {top, bottom});
    if (!strict) {
        // Keep every cell the chunk spans ordered by top
        for (let cell of chunk.cells) {
            let placed = placedIn(cell, pass);
            let low = 0;
            let high = placed.length;
            while (low < high) {
                let mid = (low + high) >> 1;
                if (placed[mid].top <= top) {
                    low = mid + 1;
                } else {
                    high = mid;
                }
            }
            placed.splice(low, 0, chunk);
        }
    }

    return top;
}

export function getSlotTimeLimits(dayTimeLimits, date) {
    return dayTimeLimits[toTime(date)] ?? {min: createDuration(0), max: createDuration('24:00:00')};
}
