import {datesEqual} from './date.js';
import {eventIntersects} from './events.js';
import {assign} from './utils.js';

/**
 * @returns {{
 *   id?: String,  // this can be used as key in Svelte keyed each block
 *   start: Date,
 *   end: Date,
 *   event: Object,
 *   zeroDuration: boolean,
 *   gridColumn?: Number,
 *   gridRow?: Number,
 *   group?: Object,
 *   groupColumn?: Number,
 *   dates?: Array
 *   day?: Array,
 *   long?: Object,
 *   prev?: Object,
 *   top?: Number,
 *   bottom?: Number,
 *   left?: Number,
 *   height?: Number,
 *   width?: Number,
 *   maxHeight?: Number
 * }}
 */
export function createEventChunk(event, start, end) {
    start = event.start > start ? event.start : start;
    end = event.end < end ? event.end : end;
    return {
        start,
        end,
        event,
        zeroDuration: datesEqual(start, end)
    };
}

/**
 * Create event chunk for month view and all-day slot in week view
 */
export function createAllDayChunks(event, days, withId = true) {
    let dates = [];
    let lastEnd;
    let gridColumn;
    let gridRow;
    for (let {gridColumn: column, gridRow: row, resource, dayStart, dayEnd, disabled} of days) {
        if (!disabled && eventIntersects(event, dayStart, dayEnd, resource)) {
            dates.push(dayStart);
            lastEnd = dayEnd;
            if (!gridColumn) {
                gridColumn = column;
                gridRow = row;
            }
        }
    }
    if (dates.length) {
        let chunk = createEventChunk(event, dates[0], lastEnd);
        // Chunk layout
        assign(chunk, {gridColumn, gridRow, dates});
        if (withId) {
            assignChunkId(chunk);
        }

        return [chunk];
    }

    return [];
}

/**
 * Prepare event chunks for month view and all-day slot in week view
 */
export function prepareAllDayChunks(chunks) {
    let prevChunks = {};
    let longChunks = {};
    for (let chunk of chunks) {
        let {gridColumn, gridRow} = chunk;
        // Prepare long chunks
        for (let i = 1; i < chunk.dates.length; ++ i) {
            let key = `${gridRow}_${gridColumn + i}`;
            if (longChunks[key]) {
                longChunks[key].chunks.push(chunk);
            } else {
                longChunks[key] = {
                    sorted: false,
                    chunks: [chunk]
                };
            }
        }
        let key = `${gridRow}_${gridColumn}`;
        chunk.long = longChunks[key];
        // Connect with previous chunk
        chunk.prev = prevChunks[key];
        prevChunks[key] = chunk;
    }
}

export function repositionEvent(chunk, height, top = 1) {
    if (chunk.prev) {
        top = chunk.prev.bottom + 1;
    }
    let bottom = top + height;
    if (chunk.long) {
        let longChunks = chunk.long;
        if (!longChunks.sorted) {
            longChunks.chunks.sort((a, b) => a.top - b.top);
            longChunks.sorted = true;
        }
        for (let longChunk of longChunks.chunks) {
            if (top < longChunk.bottom && bottom > longChunk.top) {
                let offset = longChunk.bottom - top + 1;
                top += offset;
                bottom += offset;
            }
        }
    }
    assign(chunk, {top, bottom});

    return top;
}

// Storage of unique event identifiers for generating chunk ids
const ids = new WeakMap();
let idCounter = 1;

export function assignChunkId(chunk) {
    let {event, gridColumn, gridRow} = chunk;
    let id = ids.get(event);
    if (!id) {
        id = idCounter++;
        ids.set(event, id);
    }
    chunk.id = `${id}-${gridColumn}-${gridRow}`;
}
