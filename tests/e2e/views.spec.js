import {test, expect, openPage} from './fixtures.js';

const VIEWS = [
    ['dayGridMonth', 'DayGrid'],
    ['timeGridWeek', 'TimeGrid'],
    ['timeGridDay', 'TimeGrid'],
    ['listWeek', 'List'],
    ['resourceTimeGridWeek', 'ResourceTimeGrid'],
    ['resourceTimelineWeek', 'ResourceTimeline']
];

for (let [view, plugin] of VIEWS) {
    test(`${view} renders with default options`, async ({page}) => {
        await openPage(page);
        await page.evaluate(([view, plugin]) => {
            let {createCalendar} = EventCalendar;
            createCalendar(document.getElementById('ec'), [EventCalendar[plugin]], {
                view,
                resources: [{id: 1, title: 'Resource A'}],
                events: [{start: '2026-10-08T10:00:00', end: '2026-10-08T12:00:00', title: 'Event', resourceId: 1}]
            });
        }, [view, plugin]);

        await expect(page.locator('.ec-toolbar .ec-title')).not.toBeEmpty();
        await expect(page.locator('.ec-event')).toHaveCount(1);
    });
}

test('renders with empty toolbar sections', async ({page}) => {
    await openPage(page);
    await page.evaluate(() => {
        let {createCalendar, DayGrid} = EventCalendar;
        createCalendar(document.getElementById('ec'), [DayGrid], {
            headerToolbar: {start: '', center: '', end: ''}
        });
    });

    await expect(page.locator('.ec-day').first()).toBeVisible();
});

test('can be destroyed right after creation', async ({page}) => {
    // https://github.com/vkurko/calendar/issues/684
    await openPage(page);
    await page.evaluate(() => {
        let {createCalendar, destroyCalendar, TimeGrid} = EventCalendar;
        destroyCalendar(createCalendar(document.getElementById('ec'), [TimeGrid], {view: 'timeGridWeek'}));
        return new Promise(resolve => setTimeout(resolve, 100));
    });

    await expect(page.locator('#ec')).toBeEmpty();
});

for (let [view, plugin] of [
    ['resourceTimelineWeek', 'ResourceTimeline'],
    ['timeGridWeek', 'TimeGrid'],
    ['resourceTimeGridWeek', 'ResourceTimeGrid']
]) {
    test(`${view} stacks events set right after resources`, async ({page}) => {
        // https://github.com/vkurko/calendar/issues/687
        await openPage(page);
        await page.evaluate(([view, plugin]) => {
            let {createCalendar} = EventCalendar;
            let resources = [{id: 1, title: 'Resource A'}];
            window.ec = createCalendar(document.getElementById('ec'), [EventCalendar[plugin]], {
                view,
                resources,
                events: []
            });
            window.resources = resources;
        }, [view, plugin]);
        await expect(page.locator('.ec-day').first()).toBeVisible();
        // Data refresh in a later task: resources first, then events
        await page.evaluate(() => {
            ec.setOption('resources', resources);
            // All-day events, as the all-day slot is where timeGrid views stack them
            ec.setOption('events', [
                {start: '2026-10-08', end: '2026-10-08', allDay: true, title: 'One', resourceId: 1},
                {start: '2026-10-08', end: '2026-10-08', allDay: true, title: 'Two', resourceId: 1}
            ]);
        });

        let events = page.locator('.ec-event');
        await expect(events).toHaveCount(2);
        let [one, two] = [await events.nth(0).boundingBox(), await events.nth(1).boundingBox()];
        expect(two.y).toBeGreaterThanOrEqual(one.y + one.height);
    });
}

test('dayGridWeek stacks events set right after resources', async ({page}) => {
    // https://github.com/vkurko/calendar/issues/687
    await openPage(page);
    await page.evaluate(() => {
        let {createCalendar, DayGrid} = EventCalendar;
        // The view must already show events, otherwise the bug does not occur
        window.ec = createCalendar(document.getElementById('ec'), [DayGrid], {
            view: 'dayGridWeek',
            events: [
                {start: '2026-10-07T08:00', end: '2026-10-07T09:00', title: 'Before A'},
                {start: '2026-10-08T09:00', end: '2026-10-08T10:00', title: 'Before B'}
            ]
        });
    });
    await expect(page.locator('.ec-event')).toHaveCount(2);
    await page.evaluate(() => {
        ec.setOption('resources', [{id: 1, title: 'Resource A'}, {id: 2, title: 'Resource B'}]);
        ec.setOption('events', [
            {start: '2026-10-08T09:00', end: '2026-10-08T11:00', title: 'One', resourceId: 1},
            {start: '2026-10-08T10:00', end: '2026-10-08T12:00', title: 'Two', resourceId: 1},
            {start: '2026-10-08T13:00', end: '2026-10-08T14:00', title: 'Three', resourceId: 2}
        ]);
    });

    let events = page.locator('.ec-event');
    await expect(events).toHaveCount(3);
    let boxes = await Promise.all([0, 1, 2].map(i => events.nth(i).boundingBox()));
    expect(boxes[1].y).toBeGreaterThanOrEqual(boxes[0].y + boxes[0].height);
    expect(boxes[2].y).toBeGreaterThanOrEqual(boxes[1].y + boxes[1].height);
});
