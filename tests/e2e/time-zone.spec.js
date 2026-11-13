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

test('addEvent and updateEvent ignore an event without a start', async ({page}) => {
    await openPage(page);
    await createCalendar(page, 'local');
    let result = await page.evaluate(() => [ec.addEvent({id: 'none'}), ec.updateEvent({id: 'date'})]);
    expect(result).toEqual([null, null]);
    expect(Object.keys(await getStarts(page)).sort()).toEqual(['date', 'floating', 'z']);
});

// The browser is in Amsterdam, the calendar is in another zone
for (let timeZone of ['local', 'UTC', '-07:00', '+05:30']) {
    test.describe(`timeZone ${timeZone} reads a Date of an event as the wall time of the calendar`, () => {
        test('events option and setOption', async ({page}) => {
            await openPage(page);
            await createCalendar(page, timeZone);
            expect(await getStarts(page)).toMatchObject({date: '2026-11-03T10:00'});
            await page.evaluate(() => ec.setOption('events', [
                {id: 'later', start: new Date(2026, 10, 3, 14, 0), end: new Date(2026, 10, 3, 15, 0)}
            ]));
            expect(await getStarts(page)).toEqual({later: '2026-11-03T14:00'});
        });

        test('addEvent with the date of dateClick', async ({page}) => {
            await openPage(page);
            await page.evaluate(timeZone => {
                let {createCalendar, TimeGrid, Interaction} = EventCalendar;
                window.clicked = [];
                window.ec = createCalendar(document.getElementById('ec'), [TimeGrid, Interaction], {
                    view: 'timeGridDay',
                    date: '2026-11-03',
                    timeZone,
                    dateClick: ({date}) => {
                        clicked.push(fmt(date));
                        ec.addEvent({id: 'new', start: date, end: new Date(date.getTime() + 3600000)});
                    }
                });
            }, timeZone);
            let day = await page.locator('.ec-body .ec-day').boundingBox();
            await page.mouse.click(day.x + 50, day.y + 300);
            let [date] = await page.evaluate(() => clicked);
            expect(await getStarts(page)).toEqual({new: date});
        });

        test('updateEvent with the result of getEventById keeps the event in place', async ({page}) => {
            await openPage(page);
            await createCalendar(page, timeZone);
            let before = await getStarts(page);
            await page.evaluate(() => {
                for (let i = 0; i < 2; ++i) {
                    ec.updateEvent(ec.getEventById('date'));
                    ec.updateEvent(ec.getEventById('z'));
                    ec.updateEvent(ec.getEventById('floating'));
                }
            });
            expect(await getStarts(page)).toEqual(before);
        });

        test('Date from an event source', async ({page}) => {
            await openPage(page);
            await page.evaluate(timeZone => {
                let {createCalendar, TimeGrid} = EventCalendar;
                window.ec = createCalendar(document.getElementById('ec'), [TimeGrid], {
                    view: 'timeGridWeek',
                    date: '2026-11-03',
                    timeZone,
                    eventSources: [{
                        events: () => [{id: 'source', start: new Date(2026, 10, 3, 10, 0), end: new Date(2026, 10, 3, 11, 0)}]
                    }]
                });
            }, timeZone);
            await expect.poll(() => getStarts(page)).toEqual({source: '2026-11-03T10:00'});
        });
    });
}

test('a Date of an event moves with a later change of timeZone, like a date without an offset', async ({page}) => {
    await openPage(page);
    await createCalendar(page, '+02:00');
    await page.evaluate(() => ec.setOption('timeZone', 'UTC'));
    expect(await getStarts(page)).toEqual(
        {date: '2026-11-03T08:00', z: '2026-11-03T09:00', floating: '2026-11-03T08:00'}
    );
});
