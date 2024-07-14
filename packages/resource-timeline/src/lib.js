import {createDuration} from '@event-calendar/core';

export function repositionEvent(chunk, dayChunks, longChunks, height, allDay) {
    chunk.top = 0;
    chunk.bottom = height;
    let margin = 1;
    let key = chunk.date.getTime();
    longChunks = longChunks?.[key]?.chunks ?? [];
    let chunks = [...dayChunks, ...longChunks];
    chunks.sort((a, b) => (a.top ?? 0) - (b.top ?? 0) || a.start - b.start || b.event.allDay - a.event.allDay);
    for (let dayChunk of chunks) {
        if (dayChunk === chunk) {
            continue;
        }
        if ((allDay || chunk.start < dayChunk.end && chunk.end > dayChunk.start) && chunk.top < dayChunk.bottom && chunk.bottom > dayChunk.top) {
            let offset = dayChunk.bottom - chunk.top + 1;
            margin += offset;
            chunk.top += offset;
            chunk.bottom += offset;
        }
    }

    return margin;
}

export function getSlotTimeLimits($_dayTimeLimits, date) {
    return $_dayTimeLimits[date.getTime()] ?? {min: createDuration(0), max: createDuration(0)};
}
