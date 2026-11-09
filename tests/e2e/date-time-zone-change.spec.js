import {test, expect, openPage} from './fixtures.js';

test('changing timeZone moves the date by the days between today in the two zones', async ({page}) => {
    // It is 23:30 UTC on Saturday 10 October 2026, so Sunday 11 October in Amsterdam
    await page.clock.setFixedTime(new Date('2026-10-10T23:30:00Z'));
    await openPage(page);
    await page.evaluate(() => {
        let {createCalendar, TimeGrid} = EventCalendar;
        window.ec = createCalendar(document.getElementById('ec'), [TimeGrid], {view: 'timeGridDay'});
    });
    let getDate = () => page.evaluate(() => fmt(ec.getOption('date')).substring(0, 10));
    expect(await getDate()).toBe('2026-10-11');

    for (let [timeZone, date] of [['UTC', '2026-10-10'], ['local', '2026-10-11'], ['-05:00', '2026-10-10']]) {
        await page.evaluate(timeZone => ec.setOption('timeZone', timeZone), timeZone);
        expect([timeZone, await getDate()]).toEqual([timeZone, date]);
    }

    // The same when the calendar is created with the time zone, the default date is today in the browser
    await page.evaluate(() => {
        EventCalendar.destroyCalendar(ec);
        window.ec = EventCalendar.createCalendar(document.getElementById('ec'), [EventCalendar.TimeGrid], {
            view: 'timeGridDay',
            timeZone: 'UTC'
        });
    });
    expect(await getDate()).toBe('2026-10-10');
});
