import {
    assign, assignChunkId, createDuration, createEventChunk, eventIntersects, getPayload, max, min, toTime
} from '#lib';

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

/**
 * Prepare the chunks for the layout done by layoutChunks(). The chunks come in the eventOrder order.
 *
 * The layout has two levels. The chunks are split into units: the chunks of the same layoutGroup within a
 * resource row, or a single chunk. The chunks of a unit are laid out among themselves, which gives the unit
 * its shape: a rectangle from the start of its first chunk to the end of its last one, as high as its chunks
 * need. The units are laid out in the row as such rectangles, so no chunk can get inside the rectangle of
 * another unit. A unit is laid out at the place of its first chunk in eventOrder.
 *
 * Both levels follow the same rules, see place(). Only the items whose spans intersect compete for a place,
 * and an item is placed with regard to the items that come before it in the order, which are its `rivals`
 * @param chunks
 * @param monthView  whether the slots are days, so that a chunk fills its days whatever its time
 * @return {Array} the units in the order of the layout
 */
export function prepareChunks(chunks, monthView) {
    let units = [];
    // Units made of a layoutGroup rather than a single chunk, keyed by resource row and layoutGroup
    let groupUnits = {};
    for (let chunk of chunks) {
        let {gridColumn, gridRow, dates, start, end, event: {layoutGroup}} = chunk;
        // The part of the row the chunk takes, as [start, end): its columns when it fills its days,
        // and its time otherwise. The time matches the position on the screen, as the chunk is cut
        // to the visible part of its days and hidden hours between days are not shown
        chunk.span = monthView ? [gridColumn, gridColumn + dates.length] : [+start, +end];
        let unit;
        if (layoutGroup !== undefined) {
            let key = `${gridRow}_${layoutGroup}`;
            unit = groupUnits[key];
            if (!unit) {
                unit = addUnit(chunk, units);
                groupUnits[key] = unit;
            }
        } else {
            unit = addUnit(chunk, units);
        }
        // The chunks of the unit coming earlier whose spans intersect
        chunk.rivals = unit.chunks.filter(other => spanIntersects(other.span, chunk.span));
        unit.chunks.push(chunk);
        extendSpan(unit.span, chunk.span);
        unit.startColumn = min(unit.startColumn, gridColumn);
        unit.endColumn = max(unit.endColumn, gridColumn + dates.length);
    }
    // A cell is one day (column) of one resource row. It lists the units spanning it and the units starting
    // in it, so that the units whose spans may intersect are found quickly. Each cell lists only the units
    // coming earlier, as a unit adds itself to the cells after collecting its rivals
    let cells = [];
    let cellAt = (row, column) => (cells[row] ??= [])[column] ??= {spanning: [], starting: []};
    for (let unit of units) {
        let {gridRow, startColumn, endColumn, span} = unit;
        // The units coming earlier whose spans intersect. Sharing a column with the unit, such a unit either
        // spans its first column or starts in one of the following columns, but not both, so it is met once
        let rivals = [];
        let first = cellAt(gridRow, startColumn);
        for (let other of first.spanning) {
            if (spanIntersects(other.span, span)) {
                rivals.push(other);
            }
        }
        for (let column = startColumn + 1; column < endColumn; ++column) {
            for (let other of cellAt(gridRow, column).starting) {
                if (spanIntersects(other.span, span)) {
                    rivals.push(other);
                }
            }
        }
        unit.rivals = rivals;
        first.starting.push(unit);
        for (let column = startColumn; column < endColumn; ++column) {
            cellAt(gridRow, column).spanning.push(unit);
        }
    }

    return units;
}

function addUnit(chunk, units) {
    let {gridColumn, gridRow, span} = chunk;
    let unit = {
        gridRow,
        chunks: [],
        span: [...span],
        startColumn: gridColumn,
        endColumn: gridColumn
    };
    units.push(unit);
    return unit;
}

function spanIntersects([start, end], [otherStart, otherEnd]) {
    return start < otherEnd && end > otherStart;
}

function extendSpan(span, other) {
    span[0] = min(span[0], other[0]);
    span[1] = max(span[1], other[1]);
}

/**
 * Lay out the chunks of the units prepared by prepareChunks(): set `top` and `bottom` of each chunk
 * @param units
 * @param heights  the heights of the chunks, by chunk
 * @param strict   the eventOrderStrict option
 * @param gap      the eventGap option
 */
export function layoutChunks(units, heights, strict, gap) {
    for (let unit of units) {
        // Lay out the chunks of the unit among themselves, from the top of the unit
        let height = 0;
        for (let chunk of unit.chunks) {
            let top = place(chunk.rivals, heights.get(chunk), 0, strict, gap);
            assign(chunk, {top, bottom: top + heights.get(chunk)});
            height = max(height, chunk.bottom);
        }
        // Lay out the unit in the row and move its chunks there
        let top = place(unit.rivals, height, 1, strict, gap);
        assign(unit, {top, bottom: top + height});
        for (let chunk of unit.chunks) {
            chunk.top += top;
            chunk.bottom += top;
        }
    }
}

/**
 * Find the top for an item of the given height among its rivals, which are already placed. In the strict
 * layout, the item goes below all of them, so that it never gets above an item that comes earlier in the
 * order. Otherwise it takes the topmost gap it fits in, for compactness
 */
function place(rivals, height, top, strict, gap) {
    if (strict) {
        for (let other of rivals) {
            top = max(top, other.bottom + gap);
        }
    } else {
        // Sorting in place is cheap on repeated layouts, as the order by top rarely changes
        for (let other of rivals.sort((a, b) => a.top - b.top)) {
            if (other.top >= top + height) {
                // The rest is below the item, so it can't be pushed down any further
                break;
            }
            if (top < other.bottom) {
                top = other.bottom + gap;
            }
        }
    }

    return top;
}

export function getSlotTimeLimits(dayTimeLimits, date) {
    return dayTimeLimits[toTime(date)] ?? {min: createDuration(0), max: createDuration('24:00:00')};
}

export function isExpanded(resource, initiallyExpanded) {
    return resource.expanded ?? initiallyExpanded;
}

export function isHidden(resource, initiallyExpanded) {
    for (let parent = getPayload(resource).parent; parent; parent = getPayload(parent).parent) {
        if (!isExpanded(parent, initiallyExpanded)) {
            return true;
        }
    }
    return false;
}
