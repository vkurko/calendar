export function repositionEvent(chunk, dayChunks, longChunks, height) {
    chunk.top = 0;
    chunk.bottom = height;
    dayChunks.sort((a, b) => (a.top ?? 0) - (b.top ?? 0) || a.start - b.start || b.event.allDay - a.event.allDay);
    let margin = 1;
    for (let dayChunk of dayChunks) {
        if (dayChunk === chunk) {
            continue;
        }
        if (chunk.start < dayChunk.end && chunk.end > dayChunk.start && chunk.top < dayChunk.bottom && chunk.bottom > dayChunk.top) {
            let offset = dayChunk.bottom - chunk.top + 1;
            margin += offset;
            chunk.top += offset;
            chunk.bottom += offset;
        }
    }
    let key = chunk.date.getTime();
    if (longChunks[key]) {
        if (!longChunks[key].sorted) {
            longChunks[key].chunks.sort((a, b) => a.top - b.top);
            longChunks[key].sorted = true;
        }
        for (let longChunk of longChunks[key].chunks) {
            if (chunk.start < longChunk.end && chunk.end > longChunk.start && chunk.top < longChunk.bottom && chunk.bottom > longChunk.top) {
                let offset = longChunk.bottom - chunk.top + 1;
                margin += offset;
                chunk.top += offset;
                chunk.bottom += offset;
            }
        }
    }

    return margin;
}
