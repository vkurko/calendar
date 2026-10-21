import {describe, expect, it} from 'vitest';
import {layoutChunks, prepareChunks} from '../../packages/core/src/plugins/resource-timeline/lib.js';

const HEIGHT = 20;
const GAP = 1;

/**
 * Lay out chunks given as [title, first column, number of columns, layoutGroup] in eventOrder
 * and return the line of each one by its title. Columns are days
 */
function layout(items, strict = true) {
    return run(items.map(([title, gridColumn, span, layoutGroup]) => ({
        event: {title, layoutGroup},
        gridColumn,
        gridRow: 1,
        dates: Array(span).fill(null)
    })), true, strict);
}

/**
 * Same within one day of a view with time slots, chunks given as [title, start hour, end hour, layoutGroup]
 */
function layoutDay(items) {
    return run(items.map(([title, start, end, layoutGroup]) => ({
        event: {title, layoutGroup},
        start: new Date(2026, 9, 8, start),
        end: new Date(2026, 9, 8, end),
        gridColumn: 1,
        gridRow: 1,
        dates: [null]
    })), false);
}

function run(chunks, monthView, strict = true) {
    let units = prepareChunks(chunks, monthView);
    layoutChunks(units, new Map(chunks.map(chunk => [chunk, HEIGHT])), strict, GAP);
    let lines = {};
    for (let chunk of chunks) {
        lines[chunk.event.title] = (chunk.top - 1) / (HEIGHT + GAP);
    }
    return lines;
}

describe('strict layout with layoutGroup', () => {
    it('keeps the chunks of a group not sharing a column on the same line', () => {
        expect(layout([
            ['job', 5, 3, 'a'],
            ['step', 6, 1, 'a'],
            ['before', 2, 1, 'a'],
            ['after', 10, 1, 'a']
        ])).toEqual({job: 0, step: 1, before: 0, after: 0});
    });

    it('does not interleave groups on the same line', () => {
        expect(layout([
            ['A1', 1, 2, 'a'],
            ['B1', 5, 2, 'b'],
            ['A2', 9, 2, 'a'],
            ['B2', 13, 2, 'b']
        ])).toEqual({A1: 0, A2: 0, B1: 1, B2: 1});
    });

    it('places other events below the whole span of an earlier group', () => {
        expect(layout([
            ['A start', 1, 1, 'a'],
            ['job A', 12, 5, 'a'],
            ['step A', 13, 2, 'a'],
            ['A end', 26, 1, 'a'],
            ['job B', 4, 5, 'b'],
            ['step B', 5, 2, 'b'],
            ['job C', 18, 5],
            ['job D', 28, 2]
        ])).toEqual({
            'A start': 0, 'job A': 0, 'step A': 1, 'A end': 0,
            'job B': 2, 'step B': 3, 'job C': 2, 'job D': 0
        });
    });

    it('lays out a group at the place of its first event even if others come between', () => {
        expect(layout([
            ['A1', 1, 2, 'a'],
            ['other', 5, 2],
            ['A2', 9, 2, 'a']
        ])).toEqual({A1: 0, A2: 0, other: 1});
    });

    it('lays out events without a group as before', () => {
        expect(layout([
            ['first', 1, 3],
            ['second', 2, 3],
            ['third', 5, 1]
        ])).toEqual({first: 0, second: 1, third: 0});
    });

    it('keeps events of the same day that do not overlap in time on the same line', () => {
        expect(layoutDay([
            ['morning', 9, 10],
            ['afternoon', 14, 15],
            ['overlap', 9, 11]
        ])).toEqual({morning: 0, afternoon: 0, overlap: 1});
    });

    it('measures the span of a group in time within a day', () => {
        expect(layoutDay([
            ['A1', 8, 9, 'a'],
            ['A2', 12, 13, 'a'],
            ['inside', 10, 11],
            ['outside', 14, 15]
        ])).toEqual({A1: 0, A2: 0, inside: 1, outside: 0});
    });
});

describe('compact layout', () => {
    it('lets an event take a gap above an earlier one', () => {
        let items = [
            ['first', 1, 3],
            ['second', 2, 3],
            ['third', 4, 2]
        ];
        expect(layout(items, false)).toEqual({first: 0, second: 1, third: 0});
        expect(layout(items)).toEqual({first: 0, second: 1, third: 2});
    });

    it('does not interleave groups on the same line', () => {
        expect(layout([
            ['A1', 1, 2, 'a'],
            ['B1', 5, 2, 'b'],
            ['A2', 9, 2, 'a'],
            ['B2', 13, 2, 'b']
        ], false)).toEqual({A1: 0, A2: 0, B1: 1, B2: 1});
    });

    it('lets a whole group take a gap above an earlier event', () => {
        expect(layout([
            ['first', 1, 3],
            ['second', 2, 3],
            ['G1', 4, 1, 'g'],
            ['G2', 7, 1, 'g']
        ], false)).toEqual({first: 0, second: 1, G1: 0, G2: 0});
    });

    it('lays out the events of a group compactly among themselves', () => {
        let items = [
            ['P', 1, 2, 'a'],
            ['Q', 1, 4, 'a'],
            ['R', 3, 2, 'a']
        ];
        expect(layout(items, false)).toEqual({P: 0, Q: 1, R: 0});
        expect(layout(items)).toEqual({P: 0, Q: 1, R: 2});
    });
});
