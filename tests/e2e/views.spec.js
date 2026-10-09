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
