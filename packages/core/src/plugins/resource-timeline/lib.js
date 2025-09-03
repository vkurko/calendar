import {addDay, addDuration, cloneDate, createDuration, datesEqual, sortEventChunks, toSeconds} from '#lib';

export function prepareEventChunks(chunks, $_viewDates, $_dayTimeLimits, $slotDuration, $eventOrder) {
    let longChunks = {};
    let filteredChunks = [];

    if (chunks.length) {
        sortEventChunks(chunks, $eventOrder);

        let step = toSeconds($slotDuration);
        let prevChunk;
        for (let chunk of chunks) {
            let prevDayEnd;
            if (step) {
                let slots = 0;
                for (let i = 0; i < $_viewDates.length; ++i) {
                    let slotTimeLimits = getSlotTimeLimits($_dayTimeLimits, $_viewDates[i]);
                    let dayStart = addDuration(cloneDate($_viewDates[i]), slotTimeLimits.min);
                    let dayEnd = addDuration(cloneDate($_viewDates[i]), slotTimeLimits.max);
                    if (!chunk.date) {
                        if (chunk.start < dayEnd && chunk.end > dayStart) {
                            // The first day is found
                            chunk.date = $_viewDates[i];
                            if (chunk.start < dayStart) {
                                // Adjust chunk start
                                chunk.start = dayStart;
                            }
                            // Calculate offset
                            chunk.offset = (chunk.start - dayStart) / 1000 / step;
                            // Calculate slots
                            if (chunk.end > dayEnd) {
                                slots += dayEnd - chunk.start;
                            } else {
                                slots += chunk.end - chunk.start || step * 1000;
                                break;
                            }
                        }
                    } else {
                        if (chunk.end <= dayStart) {
                            // Adjust chunk end
                            chunk.end = prevDayEnd;
                            break;
                        }
                        // The chunk is long one
                        let key = $_viewDates[i].getTime();
                        if (longChunks[key]) {
                            longChunks[key].push(chunk);
                        } else {
                            longChunks[key] = [chunk];
                        }
                        // Calculate slots
                        if (chunk.end > dayEnd) {
                            slots += dayEnd - dayStart;
                        } else {
                            slots += chunk.end - dayStart;
                            break;
                        }
                    }
                    prevDayEnd = dayEnd;
                }
                chunk.slots = slots / 1000 / step;
            } else {
                // Month view
                let days = 0;
                for (let i = 0; i < $_viewDates.length; ++i) {
                    let dayStart = $_viewDates[i];
                    let dayEnd = addDay(cloneDate(dayStart));
                    if (!chunk.date) {
                        if (chunk.start < dayEnd) {
                            // The first day is found
                            chunk.date = dayStart;
                            if (chunk.start < dayStart) {
                                // Adjust chunk start
                                chunk.start = dayStart;
                            }
                            ++days;
                        }
                    } else {
                        if (chunk.end <= dayStart) {
                            // Adjust chunk end
                            chunk.end = prevDayEnd;
                            break;
                        }
                        // The chunk is long one
                        let key = dayStart.getTime();
                        if (longChunks[key]) {
                            longChunks[key].push(chunk);
                        } else {
                            longChunks[key] = [chunk];
                        }
                        ++days;
                    }
                    prevDayEnd = dayEnd;
                }
                chunk.days = days;
            }

            if (!chunk.date) {
                // Chunk is outside the slot time limits, so skip it
                continue;
            }

            if (prevChunk && datesEqual(prevChunk.date, chunk.date)) {
                chunk.prev = prevChunk;
            }
            prevChunk = chunk;
            filteredChunks.push(chunk);
        }
    }

    return [filteredChunks, longChunks];
}

export function repositionEvent(chunk, dayChunks, longChunks, height, allDay) {
    chunk.top = 0;
    chunk.bottom = height;
    let margin = 1;
    let key = chunk.date.getTime();
    longChunks = longChunks?.[key] ?? [];
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
