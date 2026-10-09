import {test, expect, openPage, drag, center} from './fixtures.js';

// Slots are 30 minutes and 24px high by default
const HOUR = 48;

async function createCalendar(page, options = {}) {
    await openPage(page);
    await page.evaluate(options => {
        let {createCalendar, TimeGrid, Interaction} = EventCalendar;
        window.calls = [];
        let log = name => info => calls.push({
            name,
            start: fmt(info.event?.start ?? info.start),
            end: fmt(info.event?.end ?? info.end)
        });
        window.ec = createCalendar(document.getElementById('ec'), [TimeGrid, Interaction], {
            view: 'timeGridWeek',
            date: '2026-11-03',
            editable: true,
            selectable: true,
            events: [{id: '1', start: '2026-11-03T10:00:00', end: '2026-11-03T12:00:00', title: 'Event'}],
            eventDrop: log('eventDrop'),
            eventResize: log('eventResize'),
            select: log('select'),
            // Refuse Wednesday when the test asks for it
            dragConstraint: options.refuseWednesday ? info => info.event.start.getDay() !== 3 : undefined,
            eventResizableFromStart: options.eventResizableFromStart
        });
    }, options);
}

async function getLayout(page) {
    let event = await page.locator('.ec-event').boundingBox();
    let column = async day => page.locator(`.ec-body .ec-day.ec-${day}`).boundingBox();
    return {
        event,
        mon: await column('mon'),
        tue: await column('tue'),
        wed: await column('wed'),
        // Vertical position of the given hour, the event starts at 10:00
        y: hour => event.y + (hour - 10) * HOUR
    };
}

function getCalls(page) {
    return page.evaluate(() => calls);
}

function getEvent(page) {
    return page.evaluate(() => {
        let event = ec.getEventById('1');
        return {start: fmt(event.start), end: fmt(event.end)};
    });
}

test('dragging an event to another day and time', async ({page}) => {
    await createCalendar(page);
    let {event, tue, wed} = await getLayout(page);
    let from = center(event);
    await drag(page, from, {x: from.x + wed.x - tue.x, y: from.y + HOUR});

    expect(await getCalls(page)).toEqual([{name: 'eventDrop', start: '2026-11-04T11:00', end: '2026-11-04T13:00'}]);
    expect(await getEvent(page)).toEqual({start: '2026-11-04T11:00', end: '2026-11-04T13:00'});
});

test('dragging to a position refused by dragConstraint cancels the drop', async ({page}) => {
    await createCalendar(page, {refuseWednesday: true});
    let {event, tue, wed} = await getLayout(page);
    let from = center(event);
    await drag(page, from, {x: from.x + wed.x - tue.x, y: from.y});

    expect(await getCalls(page)).toEqual([]);
    expect(await getEvent(page)).toEqual({start: '2026-11-03T10:00', end: '2026-11-03T12:00'});
});

test('resizing the end of an event', async ({page}) => {
    await createCalendar(page);
    let resizer = center(await page.locator('.ec-event .ec-resizer:not(.ec-start)').boundingBox());
    await drag(page, resizer, {x: resizer.x, y: resizer.y + HOUR});

    expect(await getCalls(page)).toEqual([{name: 'eventResize', start: '2026-11-03T10:00', end: '2026-11-03T13:00'}]);
});

test('resizing the start of an event', async ({page}) => {
    await createCalendar(page, {eventResizableFromStart: true});
    let resizer = center(await page.locator('.ec-event .ec-resizer.ec-start').boundingBox());
    await drag(page, resizer, {x: resizer.x, y: resizer.y - HOUR});

    expect(await getCalls(page)).toEqual([{name: 'eventResize', start: '2026-11-03T09:00', end: '2026-11-03T12:00'}]);
});

test('selecting a time range', async ({page}) => {
    await createCalendar(page);
    let {mon, y} = await getLayout(page);
    let x = mon.x + mon.width / 2;
    // From the 9:00 slot to the 10:30 slot
    await drag(page, {x, y: y(9) + HOUR / 4}, {x, y: y(10.5) + HOUR / 4});

    expect(await getCalls(page)).toEqual([{name: 'select', start: '2026-11-02T09:00', end: '2026-11-02T11:00'}]);
});
