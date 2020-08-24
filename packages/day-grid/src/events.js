import {cloneDate, addDay, setMidnight, datesEqual} from '@event-calendar/common';
import {sortEventChunks} from '@event-calendar/common';

export function prepareEventChunks(chunks, hiddenDays) {
    if (!chunks.length) {
        return;
    }

    sortEventChunks(chunks);

    let longChunks = {};
    let prevChunk;
    for (let chunk of chunks) {
        while (hiddenDays.includes(chunk.start.getDay())) {
            // Try to move the start up to the first visible day
            let start = addDay(setMidnight(cloneDate(chunk.start)));
            if (start > chunk.end) {
                break;
            }
            chunk.start = start;
        }
        chunk.date = setMidnight(cloneDate(chunk.start));
        chunk.days = 1;
        let date = addDay(cloneDate(chunk.date));
        while (chunk.end > date) {
            ++chunk.days;
            let key = date.getTime();
            if (longChunks[key]) {
                longChunks[key].push(chunk);
            } else {
                longChunks[key] = [chunk];
            }
            addDay(date);
        }
        if (prevChunk && datesEqual(prevChunk.date, chunk.date)) {
            chunk.prev = prevChunk;
        }
        prevChunk = chunk;
    }

    return longChunks;
}
