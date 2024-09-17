import {is_function} from '@event-calendar/core';
import {sortEventChunks} from '@event-calendar/core';

export function groupEventChunks(chunks) {
    if (!chunks.length) {
        return;
    }

    sortEventChunks(chunks);

    // Group
    let group = {
        columns: [],
        end: chunks[0].end
    };
    for (let chunk of chunks) {
        let c = 0;
        if (chunk.start < group.end) {
            for (; c < group.columns.length; ++c) {
                if (group.columns[c].at(-1).end <= chunk.start) {
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

        if (group.columns.length < c + 1) {
            group.columns.push([]);
        }
        group.columns[c].push(chunk);

        chunk.group = group;
        chunk.column = c;
    }
}

export function createAllDayContent(allDayContent) {
    let text = 'all-day';
    let content;
    if (allDayContent) {
        content = is_function(allDayContent) ? allDayContent({text}) : allDayContent;
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
