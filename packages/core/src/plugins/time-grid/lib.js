import {
    addDuration, assign, assignChunkId, cloneDate, createEventChunk, DAY_IN_SECONDS, eventIntersects, isFunction,
    subtractDay
} from '#lib';

export function createChunks(event, days, withId = true) {
    let chunks = [];
    for (let {gridColumn, gridRow, resource, start, end, disabled} of days) {
        if (!disabled && eventIntersects(event, start, end, resource)) {
            let chunk = createEventChunk(event, start, end);
            // Chunk layout
            assign(chunk, {
                gridColumn,
                gridRow,
                resource,
                top: (chunk.start - start) / 1000,
                height: (chunk.end - chunk.start) / 1000,
                maxHeight: (end - chunk.start) / 1000
            });
            if (withId) {
                assignChunkId(chunk);
            }
            chunks.push(chunk);
        }
    }
    return chunks;
}

export function groupChunks(chunks) {
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

export function setExtensions(mainState) {
    mainState.extensions.activeRange = (start, end) => {
        // Dependencies
        let {options: {slotMaxTime}} = mainState;
        if (slotMaxTime.days || slotMaxTime.seconds > DAY_IN_SECONDS) {
            addDuration(subtractDay(end), slotMaxTime);
            let start2 = subtractDay(cloneDate(end));
            if (start2 < start) {
                start = start2;
            }
        }
        return {start, end};
    };
}
