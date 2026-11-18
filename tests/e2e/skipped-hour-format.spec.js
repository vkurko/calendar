import {test, expect, openPage} from './fixtures.js';

// The browser's clocks go forward on 28 March 2027 at 02:00, so a local Date cannot hold 02:30 on that day
for (let timeZone of ['local', 'UTC', '-07:00']) {
    test(`timeZone ${timeZone} shows a time in the hour the browser skips as it is`, async ({page}) => {
        await openPage(page);
        await page.evaluate(timeZone => {
            let {createCalendar, TimeGrid} = EventCalendar;
            window.ec = createCalendar(document.getElementById('ec'), [TimeGrid], {
                view: 'timeGridDay',
                date: '2027-03-28',
                timeZone,
                events: [{start: '2027-03-28T02:30:00', end: '2027-03-28T03:30:00', title: 'Skipped'}]
            });
        }, timeZone);
        await expect(page.locator('.ec-event')).toHaveText(/2:30\s–\s3:30\sAMSkipped/);
    });
}
