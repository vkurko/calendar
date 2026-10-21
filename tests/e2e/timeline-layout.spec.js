import {test, expect, openPage, drag, center} from './fixtures.js';

/**
 * Create a resourceTimelineMonth view for October 2026 with the given events, which come in eventOrder
 * as listed. Events are given as [title, first day, number of days, layoutGroup, resourceId]
 */
async function createCalendar(page, events, options = {}) {
    await openPage(page);
    await page.evaluate(([events, options]) => {
        let {createCalendar, ResourceTimeline, Interaction} = EventCalendar;
        window.calls = [];
        let date = day => `2026-10-${String(day).padStart(2, '0')}`;
        window.ec = createCalendar(document.getElementById('ec'), [ResourceTimeline, Interaction], {
            view: 'resourceTimelineMonth',
            date: '2026-10-01',
            // All days fit in the view, so that it does not scroll while dragging
            columnWidth: '30px',
            editable: true,
            resources: [{id: 1, title: 'Resource A'}, {id: 2, title: 'Resource B'}],
            eventOrder: (a, b) => a.extendedProps.order - b.extendedProps.order,
            events: events.map(([title, day, days, layoutGroup, resourceId = 1], order) => ({
                id: title, title, start: date(day), end: date(day + days), allDay: true, resourceId, layoutGroup,
                extendedProps: {order}
            })),
            eventDrop: info => calls.push([info.event.title, fmt(info.event.start), info.event.resourceIds[0]]),
            eventResize: info => calls.push([info.event.title, fmt(info.event.end)]),
            ...options
        });
    }, [events, options]);
    await expect(page.locator('.ec-event')).toHaveCount(events.length);
}

function event(page, title) {
    return page.locator('.ec-event', {hasText: title});
}

/**
 * The center of the cell of the given day of October in the row of the given resource
 */
async function cell(page, day, row = 1) {
    let days = page.locator('.ec-body .ec-day');
    let count = await days.count();
    return center(await days.nth((row - 1) * count / 2 + day - 1).boundingBox());
}

/**
 * The lines of events, counted from 0 at the top of the row of the first resource
 */
async function lines(page, titles) {
    let boxes = {};
    for (let title of titles) {
        boxes[title] = await event(page, title).boundingBox();
    }
    let step = boxes[titles[0]].height + 1;
    let row = await page.locator('.ec-body .ec-day').first().boundingBox();
    let result = {};
    for (let title of titles) {
        result[title] = Math.round((boxes[title].y - row.y - 1) / step);
    }
    return result;
}

/**
 * Drag the event by its middle to the cell of the given day, keeping the offset of the grab point within it
 */
async function dragEvent(page, title, fromDay, toDay, row = 1) {
    let box = await event(page, title).boundingBox();
    let from = await cell(page, fromDay);
    let to = await cell(page, toDay, row);
    let grab = {x: from.x, y: box.y + box.height / 2};
    await drag(page, grab, {x: to.x, y: to.y - from.y + grab.y});
}

for (let strict of [false, true]) {
    test.describe(strict ? 'strict' : 'compact', () => {
        test('dragging an event into the span of a layout group moves it below the group and back', async ({page}) => {
            await createCalendar(page, [
                ['A1', 2, 1, 'a'],
                ['A2', 9, 1, 'a'],
                ['Other', 13, 2]
            ], {eventOrderStrict: strict});
            expect(await lines(page, ['A1', 'A2', 'Other'])).toEqual({A1: 0, A2: 0, Other: 0});

            await dragEvent(page, 'Other', 13, 5);
            await expect.poll(() => lines(page, ['A1', 'A2', 'Other'])).toEqual({A1: 0, A2: 0, Other: 1});

            await dragEvent(page, 'Other', 5, 16);
            await expect.poll(() => lines(page, ['A1', 'A2', 'Other'])).toEqual({A1: 0, A2: 0, Other: 0});
            expect(await page.evaluate(() => calls)).toEqual([
                ['Other', '2026-10-05T00:00', '1'],
                ['Other', '2026-10-16T00:00', '1']
            ]);
        });

        test('dragging an event of a layout group widens the span of the group', async ({page}) => {
            await createCalendar(page, [
                ['A1', 2, 1, 'a'],
                ['A2', 9, 1, 'a'],
                ['Other', 13, 2]
            ], {eventOrderStrict: strict});

            await dragEvent(page, 'A2', 9, 16);
            await expect.poll(() => lines(page, ['A1', 'A2', 'Other'])).toEqual({A1: 0, A2: 0, Other: 1});
        });

        test('dragging an event of a layout group to another resource takes it out of the group span', async ({page}) => {
            await createCalendar(page, [
                ['A1', 2, 1, 'a'],
                ['A2', 9, 1, 'a'],
                ['Other', 5, 2]
            ], {eventOrderStrict: strict});
            expect(await lines(page, ['A1', 'A2', 'Other'])).toEqual({A1: 0, A2: 0, Other: 1});

            await dragEvent(page, 'A2', 9, 9, 2);
            await expect.poll(() => lines(page, ['A1', 'Other'])).toEqual({A1: 0, Other: 0});
            expect(await page.evaluate(() => calls)).toEqual([['A2', '2026-10-09T00:00', '2']]);
        });

        test('resizing an event of a layout group over another one pushes the next events down', async ({page}) => {
            await createCalendar(page, [
                ['A1', 2, 1, 'a'],
                ['A2', 6, 1, 'a'],
                ['Other', 4, 1]
            ], {eventOrderStrict: strict});
            expect(await lines(page, ['A1', 'A2', 'Other'])).toEqual({A1: 0, A2: 0, Other: 1});

            await event(page, 'A1').hover();
            let resizer = center(await event(page, 'A1').locator('.ec-resizer').boundingBox());
            let to = await cell(page, 6);
            await drag(page, resizer, {x: to.x, y: resizer.y});
            await expect.poll(() => lines(page, ['A1', 'A2', 'Other'])).toEqual({A1: 0, A2: 1, Other: 2});
            expect(await page.evaluate(() => calls)).toEqual([['A1', '2026-10-07T00:00']]);
        });
    });
}
