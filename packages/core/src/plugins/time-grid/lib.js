import {
    addDay, addDuration, assign, bgEvent, cloneDate, createAllDayChunks, createEventChunk, datesEqual, eventIntersects,
    isFunction, outsideRange, prepareAllDayChunks,
} from '#lib';

/**
 * Days with prepared start and end times
 */
export function createGrid($_viewDates, $_slotTimeLimits, $validRange, $highlightedDates) {
    let days = [];
    let gridColumn = 1;
    for (let date of $_viewDates) {
        days.push({
            gridColumn,
            gridRow: 1,
            resource: undefined,
            start: addDuration(cloneDate(date), $_slotTimeLimits.min),
            end: addDuration(cloneDate(date), $_slotTimeLimits.max),
            dayStart: date,
            dayEnd: addDay(cloneDate(date)),
            disabled: outsideRange(date, $validRange),
            highlight: $highlightedDates.some(d => datesEqual(d, date))
        });
        ++ gridColumn;
    }

    return [days];
}

export function createEventChunks($_filteredEvents, grid) {
    let chunks = [];
    let bgChunks = [];
    let allDayChunks = [];
    let allDayBgChunks = [];
    for (let event of $_filteredEvents) {
        for (let days of grid) {
            if (bgEvent(event.display)) {
                bgChunks = bgChunks.concat(createChunks(event, days));
                if (event.allDay) {
                    allDayBgChunks = allDayBgChunks.concat(createAllDayChunks(event, days));
                }
            } else {
                if (event.allDay) {
                    allDayChunks = allDayChunks.concat(createAllDayChunks(event, days));
                } else {
                    chunks = chunks.concat(createChunks(event, days));
                }
            }
        }
    }
    groupChunks(chunks);
    prepareAllDayChunks(allDayChunks);

    return {chunks, bgChunks, allDayChunks, allDayBgChunks};
}

export function createIEventChunks($_iEvents, grid) {
    let iChunks = [];
    let allDayIChunks = [];
    for (let event of $_iEvents) {
        if (!event) {
            continue;
        }
        for (let days of grid) {
            if (event.allDay) {
                allDayIChunks = allDayIChunks.concat(createAllDayChunks(event, days));
            } else {
                iChunks = iChunks.concat(createChunks(event, days));
            }
        }
    }

    return {iChunks, allDayIChunks};
}

function createChunks(event, days) {
    let chunks = [];
    for (let {gridColumn, gridRow, resource, start, end, disabled} of days) {
        if (!disabled && eventIntersects(event, start, end, resource)) {
            let chunk = createEventChunk(event, start, end);
            // Chunk layout
            assign(chunk, {
                gridColumn,
                gridRow,
                top: (chunk.start - start) / 1000,
                height: (chunk.end - chunk.start) / 1000,
                maxHeight: (end - chunk.start) / 1000
            });
            chunks.push(chunk);
        }
    }
    return chunks;
}

function groupChunks(chunks) {
    let groups = {};
    for (let chunk of chunks) {
        let {gridColumn} = chunk;
        let group = groups[gridColumn];
        let column = 0;
        if (group && chunk.start < group.end) {
            for (; column < group.columns.length; ++ column) {
                if (group.columns[column].at(-1).end <= chunk.start) {
                    break;
                }
            }
            if (chunk.end > group.end) {
                group.end = chunk.end;
            }
        } else {
            group = {
                columns: [],
                end: chunk.end
            };
        }
        if (group.columns.length < column + 1) {
            group.columns.push([]);
        }
        group.columns[column].push(chunk);
        groups[gridColumn] = group;
        // Chunk layout
        chunk.group = group;
        chunk.groupColumn = column;
    }
}

export function createAllDayContent(allDayContent) {
    let text = 'all-day';
    let content;
    if (allDayContent) {
        content = isFunction(allDayContent) ? allDayContent({text}) : allDayContent;
        if (typeof content === 'string') {
            content = {html: content};
        }
    } else {
        content = {
            html: text
        };
    }

    return content;
}
