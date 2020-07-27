import {cloneDate, addDay, setMidnight, datesEqual} from '../../lib/date';
import {sortEventChunks} from '../../lib/events';

export function prepareEventChunks(chunks) {
    if (!chunks.length) {
        return;
    }

    sortEventChunks(chunks);

    let longChunks = {};
    let prevChunk;
    for (let chunk of chunks) {
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
