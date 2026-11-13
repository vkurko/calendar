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

test('an explicit date is not moved when the calendar is created with a time zone', async ({page}) => {
    // 01:00 on 13 November in Amsterdam is still 12 November in -07:00
    await page.clock.setFixedTime(new Date('2026-11-13T00:00:00Z'));
    await openPage(page);
    let dates = await page.evaluate(() => {
        let {createCalendar, destroyCalendar, TimeGrid} = EventCalendar;
        let result = [];
        for (let date of [new Date(2026, 10, 20), '2026-11-20', undefined]) {
            let ec = createCalendar(document.getElementById('ec'), [TimeGrid], {view: 'timeGridDay', timeZone: '-07:00', date});
            result.push(fmt(ec.getOption('date')).substring(0, 10));
            destroyCalendar(ec);
        }
        return result;
    });
    // Without a date it is today in the time zone of the calendar
    expect(dates).toEqual(['2026-11-20', '2026-11-20', '2026-11-12']);
});

test('an explicit date stays the same day when timeZone changes, undefined means today', async ({page}) => {
    // 01:00 on 13 November in Amsterdam is still 12 November in -07:00
    await page.clock.setFixedTime(new Date('2026-11-13T00:00:00Z'));
    await openPage(page);
    await page.evaluate(() => {
        let {createCalendar, TimeGrid} = EventCalendar;
        window.ec = createCalendar(document.getElementById('ec'), [TimeGrid], {
            view: 'timeGridDay',
            date: new Date(2026, 10, 20)
        });
    });
    let getDate = () => page.evaluate(() => fmt(ec.getOption('date')).substring(0, 10));

    await page.evaluate(() => ec.setOption('timeZone', '-07:00'));
    expect(await getDate()).toBe('2026-11-20');

    await page.evaluate(() => ec.setOption('date', undefined));
    expect(await getDate()).toBe('2026-11-12');
    // Today follows the time zone
    await page.evaluate(() => ec.setOption('timeZone', 'local'));
    expect(await getDate()).toBe('2026-11-13');

    await page.evaluate(() => ec.setOption('date', '2026-11-20'));
    await page.evaluate(() => ec.setOption('timeZone', '-07:00'));
    await page.evaluate(() => ec.gotoDate());
    expect(await getDate()).toBe('2026-11-12');
});
