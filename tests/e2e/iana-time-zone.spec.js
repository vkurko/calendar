import {test, expect, openPage} from './fixtures.js';

function getStarts(page) {
    return page.evaluate(() => Object.fromEntries(ec.getEvents().map(event => [event.id, fmt(event.start)])));
}

// IANA time zone names. The browser runs in Europe/Amsterdam unless a test sets its own zone

// The slots are 30 minutes and 24px high by default
const HOUR = 48;

async function showCalendar(page, {plugin = 'TimeGrid', ...options}) {
    await page.evaluate(([plugin, options]) => {
        // window.ec is the element with the id ec until a calendar is assigned to it
        if (window.calendar) {
            EventCalendar.destroyCalendar(window.calendar);
        }
        window.ec = window.calendar = EventCalendar.createCalendar(
            document.getElementById('ec'), [EventCalendar[plugin]], options
        );
    }, [plugin, options]);
    await expect(page.locator('.ec-day').first()).toBeVisible();
    await settle(page);
}

function settle(page) {
    return page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
}

test.describe('timeZone as an IANA name', () => {
    test('shows the wall time of the zone on both sides of its DST change', async ({page}) => {
        await openPage(page);
        // Los Angeles goes to summer time on 14 March 2027, Amsterdam on 28 March
        await showCalendar(page, {
            view: 'timeGridWeek',
            date: '2027-03-14',
            timeZone: 'America/Los_Angeles',
            events: [
                {id: 'before', start: '2027-03-13T17:00:00Z', end: '2027-03-13T18:00:00Z'},
                {id: 'after', start: '2027-03-15T16:00:00Z', end: '2027-03-15T17:00:00Z'},
                {id: 'floating', start: '2027-03-15T09:00:00', end: '2027-03-15T10:00:00'}
            ]
        });
        expect(await getStarts(page)).toEqual(
            {before: '2027-03-13T09:00', after: '2027-03-15T09:00', floating: '2027-03-15T09:00'}
        );
    });

    test('switching between an IANA name, an offset and local', async ({page}) => {
        await openPage(page);
        // On 15 March 2027 Amsterdam is on UTC+1 and Los Angeles on UTC-7
        await showCalendar(page, {
            view: 'timeGridWeek',
            date: '2027-03-15',
            timeZone: 'local',
            events: [
                {id: 'z', start: '2027-03-15T09:00:00Z', end: '2027-03-15T10:00:00Z'},
                {id: 'floating', start: '2027-03-15T10:00:00', end: '2027-03-15T11:00:00'}
            ]
        });
        await page.evaluate(() => {
            ec.addEvent({id: 'date', start: new Date(2027, 2, 15, 10, 0), end: new Date(2027, 2, 15, 11, 0)});
        });
        let times = async () => Object.fromEntries(
            Object.entries(await getStarts(page)).map(([id, start]) => [id, start.substring(11)])
        );
        let all = time => ({z: time, floating: time, date: time});
        expect(await times()).toEqual(all('10:00'));
        for (let [timeZone, time] of [
            ['America/Los_Angeles', '02:00'],
            ['+02:00', '11:00'],
            ['Europe/Berlin', '10:00'],
            ['Asia/Kolkata', '14:30'],
            ['local', '10:00']
        ]) {
            await page.evaluate(timeZone => ec.setOption('timeZone', timeZone), timeZone);
            expect([timeZone, await times()]).toEqual([timeZone, all(time)]);
        }
    });

    test('an unknown name is treated as local', async ({page}) => {
        await openPage(page);
        await showCalendar(page, {
            view: 'timeGridWeek',
            date: '2027-03-15',
            timeZone: 'Europe/Atlantis',
            events: [{id: 'z', start: '2027-03-15T09:00:00Z', end: '2027-03-15T10:00:00Z'}]
        });
        expect(await getStarts(page)).toEqual({z: '2027-03-15T10:00'});
    });

    test('a name that ends with Z is not taken as UTC', async ({page}) => {
        await openPage(page);
        // NZ is an alias of Pacific/Auckland, which is on UTC+13 until 4 April 2027
        await showCalendar(page, {
            view: 'timeGridWeek',
            date: '2027-03-14',
            timeZone: 'NZ',
            events: [{id: 'z', start: '2027-03-14T10:00:00Z', end: '2027-03-14T11:00:00Z'}]
        });
        expect(await getStarts(page)).toEqual({z: '2027-03-14T23:00'});
    });

    test('today follows the zone', async ({page}) => {
        await openPage(page);
        // It is 8 October 2026 10:00 UTC, in Pago Pago (UTC-11) still 7 October and in Kiritimati (UTC+14) 9 October
        for (let [timeZone, day] of [['Pacific/Pago_Pago', 'wed'], ['Pacific/Kiritimati', 'fri'], ['local', 'thu']]) {
            await showCalendar(page, {view: 'timeGridWeek', date: '2026-10-08', timeZone});
            await expect(page.locator('.ec-body .ec-day.ec-today')).toHaveClass(new RegExp(`ec-${day}`));
        }
    });

    test('the now indicator follows the zone', async ({page}) => {
        await openPage(page);
        // It is 8 October 2026 10:00 UTC, 03:00 in Los Angeles
        await showCalendar(page, {
            view: 'timeGridDay',
            date: '2026-10-08',
            timeZone: 'America/Los_Angeles',
            nowIndicator: true,
            events: [{start: '2026-10-08T03:00:00', end: '2026-10-08T04:00:00'}]
        });
        let event = await page.locator('.ec-event').boundingBox();
        let indicator = await page.locator('.ec-now-indicator').boundingBox();
        expect(Math.abs(indicator.y - event.y)).toBeLessThanOrEqual(2);
    });

    test('event sources get the name and their events are shifted to the zone', async ({page}) => {
        await openPage(page);
        await page.evaluate(() => {
            window.fetchInfos = [];
            window.ec = EventCalendar.createCalendar(document.getElementById('ec'), [EventCalendar.TimeGrid], {
                view: 'timeGridWeek',
                date: '2027-03-15',
                timeZone: 'America/Los_Angeles',
                eventSources: [{
                    events: info => {
                        fetchInfos.push({timeZone: info.timeZone, start: info.startStr, end: info.endStr});
                        return [{id: 'z', start: '2027-03-15T09:00:00Z', end: '2027-03-15T10:00:00Z'}];
                    }
                }]
            });
        });
        await expect(page.locator('.ec-event')).toHaveCount(1);
        expect(await page.evaluate(() => fetchInfos)).toEqual(
            [{timeZone: 'America/Los_Angeles', start: '2027-03-14T00:00:00', end: '2027-03-21T00:00:00'}]
        );
        expect(await getStarts(page)).toEqual({z: '2027-03-15T02:00'});
    });
});

// Days the clocks change, per zone: the grid must be the one of local. Some days also say how the event across
// the change is drawn: its start and end as wall time and its height in hours
const DST_DAYS = {
    'America/Los_Angeles': [
        ['2027-03-14', {start: '00:30', end: '04:30', rows: 4}],
        ['2026-11-01', {start: '00:30', end: '02:30', rows: 2}]
    ],
    'Europe/Berlin': [
        ['2027-03-28', {start: '00:30', end: '04:30', rows: 4}],
        ['2026-10-25', {start: '01:30', end: '03:30', rows: 2}]
    ],
    'Australia/Sydney': [['2026-10-04'], ['2027-04-04']],
    'Australia/Lord_Howe': [['2026-10-04'], ['2027-04-04']],
    // The clocks go forward at midnight and back at 24:00
    'America/Santiago': [['2026-09-06'], ['2027-04-03']],
    'Asia/Kolkata': [['2027-03-14']]
};
const DST_VIEWS = [
    ['TimeGrid', 'timeGridDay'],
    ['TimeGrid', 'timeGridWeek'],
    ['ResourceTimeline', 'resourceTimelineDay']
];

/**
 * Events around the change of the offset: before it, across it, just before it, just after it and after it,
 * and one without an offset at the wall time of the skipped or repeated hour. Runs in the browser
 */
function dstEvents(day) {
    let minute = 60000;
    let offsetAt = time => -new Date(time).getTimezoneOffset();
    // The first quarter of an hour with another offset, searched from 15 hours before the day on.
    // A zone without a change gets the middle of the day
    let midnight = Date.parse(day + 'T00:00:00Z');
    let change = midnight - 15 * 60 * minute;
    while (change < midnight + 33 * 60 * minute && offsetAt(change) === offsetAt(change - 15 * minute)) {
        change += 15 * minute;
    }
    if (change >= midnight + 33 * 60 * minute) {
        change = midnight + 6 * 60 * minute;
    }
    let iso = ms => new Date(ms).toISOString().substring(0, 19);
    let around = (id, from, to) => ({
        id, title: id, resourceId: 1, start: iso(change + from * minute) + 'Z', end: iso(change + to * minute) + 'Z'
    });
    // The wall time that is skipped or repeated starts at the earlier one of the wall times of the change
    let wall = change + Math.min(offsetAt(change - minute), offsetAt(change)) * minute;
    return [
        around('Before', -60, -30),
        around('Across', -90, 90),
        around('JustBefore', -25, -5),
        around('JustAfter', 5, 25),
        around('After', 30, 60),
        {id: 'Floating', title: 'Floating', resourceId: 1, start: iso(wall + 5 * minute), end: iso(wall + 25 * minute)}
    ];
}

async function getLayout(page, options) {
    await showCalendar(page, options);
    return readLayout(page);
}

async function readLayout(page) {
    await expect(page.locator('.ec-event').first()).toBeVisible();
    await settle(page);

    return page.evaluate(() => {
        let origin = document.getElementById('ec').getBoundingClientRect();
        return {
            slots: [...document.querySelectorAll('aside time')].map(el => el.textContent),
            events: [...document.querySelectorAll('.ec-event')].map(el => {
                let rect = el.getBoundingClientRect();
                return [
                    el.textContent, ...[rect.x - origin.x, rect.y - origin.y, rect.width, rect.height].map(Math.round)
                ];
            }),
            dates: ec.getEvents().map(event => [event.id, fmt(event.start), fmt(event.end)])
        };
    });
}

for (let [zone, days] of Object.entries(DST_DAYS)) {
    test.describe(`${zone} on the days its clocks change`, () => {
        test.use({timezoneId: zone});

        for (let [plugin, view] of DST_VIEWS) {
            test(`${view} is the same as with local`, async ({page}) => {
                await openPage(page);
                for (let [day, across] of days) {
                    let options = {
                        plugin,
                        view,
                        date: day,
                        resources: [{id: 1, title: 'Resource'}],
                        events: await page.evaluate(dstEvents, day)
                    };
                    let expected = await getLayout(page, {...options, timeZone: 'local'});
                    let actual = await getLayout(page, {...options, timeZone: zone});
                    expect(actual, day).toEqual(expected);
                    expect(actual.events.length, day).toBeGreaterThanOrEqual(3);

                    if (across && view === 'timeGridDay') {
                        // The grid has 24 rows of wall time, so an event is as tall as its wall time is long
                        let [, start, end] = actual.dates.find(([id]) => id === 'Across');
                        expect([start.substring(11), end.substring(11)]).toEqual([across.start, across.end]);
                        let [, , , , height] = actual.events.find(([text]) => text.includes('Across'));
                        expect(height / HOUR).toBeCloseTo(across.rows, 1);
                    }
                }
            });

            test(`${view} stays the same when switching between local and the name`, async ({page}) => {
                await openPage(page);
                for (let [day] of days) {
                    // A time in the skipped hour moves forward when it is converted, so that one is left out
                    let events = (await page.evaluate(dstEvents, day)).filter(event => event.id !== 'Floating');
                    let options = {plugin, view, date: day, resources: [{id: 1, title: 'Resource'}], events};
                    let expected = await getLayout(page, {...options, timeZone: 'local'});
                    for (let [from, to] of [[zone, 'local'], ['local', zone]]) {
                        await showCalendar(page, {...options, timeZone: from});
                        await page.evaluate(timeZone => ec.setOption('timeZone', timeZone), to);
                        expect(await readLayout(page), `${day} ${from} to ${to}`).toEqual(expected);
                    }
                }
            });
        }
    });
}
