import {test, expect, openPage} from './fixtures.js';

// Today is 8 October 2026 (UTC+2 in Amsterdam), clocks go back on 25 October
async function createCalendar(page, timeZone) {
    await page.evaluate(timeZone => {
        let {createCalendar, TimeGrid} = EventCalendar;
        window.ec = createCalendar(document.getElementById('ec'), [TimeGrid], {
            view: 'timeGridWeek',
            date: '2026-11-03',
            timeZone,
            events: [
                {id: 'date', start: new Date(2026, 10, 3, 10, 0), end: new Date(2026, 10, 3, 12, 0)},
                {id: 'z', start: '2026-11-03T09:00:00Z', end: '2026-11-03T11:00:00Z'},
                {id: 'floating', start: '2026-11-03T10:00:00', end: '2026-11-03T12:00:00'}
            ]
        });
    }, timeZone);
}

function getStarts(page) {
    return page.evaluate(() => Object.fromEntries(ec.getEvents().map(event => [event.id, fmt(event.start)])));
}

test.describe('timeZone local across a DST change', () => {
    // https://github.com/vkurko/calendar/issues/686
    const EXPECTED = {date: '2026-11-03T10:00', z: '2026-11-03T10:00', floating: '2026-11-03T10:00'};

    test('events option', async ({page}) => {
        await openPage(page);
        await createCalendar(page, 'local');
        expect(await getStarts(page)).toEqual(EXPECTED);
    });

    test('updateEvent and addEvent', async ({page}) => {
        await openPage(page);
        await createCalendar(page, 'local');
        await page.evaluate(() => {
            ec.updateEvent({id: 'date', start: new Date(2026, 10, 3, 10, 0), end: new Date(2026, 10, 3, 12, 0)});
            ec.removeEventById('z');
            ec.addEvent({id: 'z', start: '2026-11-03T09:00:00Z', end: '2026-11-03T11:00:00Z'});
        });
        expect(await getStarts(page)).toEqual(EXPECTED);
    });

    test('switching to UTC and back', async ({page}) => {
        await openPage(page);
        await createCalendar(page, 'local');
        await page.evaluate(() => ec.setOption('timeZone', 'UTC'));
        // Callbacks receive the wall time of the calendar's time zone
        expect(await getStarts(page)).toEqual(
            {date: '2026-11-03T09:00', z: '2026-11-03T09:00', floating: '2026-11-03T09:00'}
        );
        await page.evaluate(() => ec.setOption('timeZone', 'local'));
        expect(await getStarts(page)).toEqual(EXPECTED);
    });
});

test('timeZone UTC converts Date objects', async ({page}) => {
    await openPage(page);
    await createCalendar(page, 'UTC');
    await page.evaluate(() => {
        ec.updateEvent({id: 'date', start: new Date(2026, 10, 3, 10, 0), end: new Date(2026, 10, 3, 12, 0)});
    });
    expect(await getStarts(page)).toMatchObject({date: '2026-11-03T09:00', z: '2026-11-03T09:00'});
});
