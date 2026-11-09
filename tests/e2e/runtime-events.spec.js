import {test, expect, openPage} from './fixtures.js';

function getStarts(page) {
    return page.evaluate(() => Object.fromEntries(ec.getEvents().map(event => [event.id, fmt(event.start)])));
}

test('events in the hour the browser skips stay where they are when the events are loaded again', async ({page}) => {
    await openPage(page);
    // The browser's clocks go forward on 28 March 2027 at 02:00, so 02:30 does not exist that day
    await page.evaluate(() => {
        let {createCalendar, TimeGrid} = EventCalendar;
        window.ec = createCalendar(document.getElementById('ec'), [TimeGrid], {
            view: 'timeGridDay',
            date: '2027-03-28',
            events: [
                {start: '2027-03-28T02:30:00', end: '2027-03-28T03:00:00', title: 'Skipped'},
                {start: '2027-03-28T04:30:00', end: '2027-03-28T05:00:00', title: 'Reference'}
            ]
        });
    });
    let top = async title => (await page.locator('.ec-event', {hasText: title}).boundingBox()).y;
    // The slots are 30 minutes and 24px high, so 2 hours are 96px
    expect(await top('Reference') - await top('Skipped')).toBe(96);

    // Navigating loads the events again
    await page.evaluate(() => ec.setOption('date', '2027-03-29'));
    await page.evaluate(() => ec.setOption('date', '2027-03-28'));
    expect(await top('Reference') - await top('Skipped')).toBe(96);
});

// The browser is in Amsterdam, UTC+1 on 15 March 2027
for (let [timeZone, time] of [['+02:00', '11:00'], ['local', '10:00'], ['UTC', '09:00']]) {
    test(`setOption events converts the dates to timeZone ${timeZone}`, async ({page}) => {
        await openPage(page);
        await page.evaluate(timeZone => {
            let {createCalendar, TimeGrid} = EventCalendar;
            window.ec = createCalendar(document.getElementById('ec'), [TimeGrid], {
                view: 'timeGridWeek',
                date: '2027-03-15',
                timeZone,
                events: [{id: 'initial', start: '2027-03-15T09:00:00Z', end: '2027-03-15T10:00:00Z'}]
            });
        }, timeZone);
        expect(await getStarts(page)).toEqual({initial: `2027-03-15T${time}`});

        await page.evaluate(() => {
            ec.setOption('events', [{id: 'later', start: '2027-03-15T09:00:00Z', end: '2027-03-15T10:00:00Z'}]);
        });
        expect(await getStarts(page)).toEqual({later: `2027-03-15T${time}`});
    });
}
