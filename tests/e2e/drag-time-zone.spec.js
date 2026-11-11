import {test, expect, openPage, drag, center} from './fixtures.js';

function getStarts(page) {
    return page.evaluate(() => Object.fromEntries(ec.getEvents().map(event => [event.id, fmt(event.start)])));
}

test('an event dragged across a DST change is converted with the new offset', async ({page}) => {
    await openPage(page);
    // Amsterdam is on UTC+1 on Saturday 27 March 2027 and on UTC+2 from the clocks going forward on Sunday
    await page.evaluate(() => {
        let {createCalendar, TimeGrid, Interaction} = EventCalendar;
        window.ec = createCalendar(document.getElementById('ec'), [TimeGrid, Interaction], {
            view: 'timeGridWeek',
            firstDay: 6,
            date: '2027-03-27',
            editable: true,
            events: [{id: 'drag', start: '2027-03-27T10:00:00', end: '2027-03-27T11:00:00'}]
        });
    });
    let from = center(await page.locator('.ec-event').boundingBox());
    let sat = await page.locator('.ec-body .ec-day.ec-sat').boundingBox();
    let tue = await page.locator('.ec-body .ec-day.ec-tue').boundingBox();
    await drag(page, from, {x: from.x + tue.x - sat.x, y: from.y});
    expect(await getStarts(page)).toEqual({drag: '2027-03-30T10:00'});

    // 10:00 on Tuesday is 08:00 UTC
    await page.evaluate(() => ec.setOption('timeZone', 'UTC'));
    expect(await getStarts(page)).toEqual({drag: '2027-03-30T08:00'});
});
