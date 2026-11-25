import {test, expect, openPage} from './fixtures.js';

// Two animation frames, so that everything scheduled before the paint is done
function frames(page) {
    return page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
}

// Number of pairs of events that overlap each other
function overlaps(page) {
    return page.evaluate(() => {
        let rects = [...document.querySelectorAll('.ec-event')].map(el => el.getBoundingClientRect());
        let count = 0;
        for (let i = 0; i < rects.length; ++i) {
            for (let j = i + 1; j < rects.length; ++j) {
                let a = rects[i], b = rects[j];
                if (a.left < b.right - 1 && b.left < a.right - 1 && a.top < b.bottom - 1 && b.top < a.bottom - 1) {
                    ++count;
                }
            }
        }
        return count;
    });
}

const EVENTS = [1, 2, 3].map(id => ({
    id, start: '2026-10-08T01:00:00', end: `2026-10-08T0${id + 1}:00:00`, title: 'Event ' + id, resourceId: 1
}));

test('content function renders into the element and cleans up', async ({page}) => {
    await openPage(page);
    await page.evaluate(events => {
        let {createCalendar, DayGrid} = EventCalendar;
        window.log = [];
        window.ec = createCalendar(document.getElementById('ec'), [DayGrid], {
            view: 'dayGridMonth',
            events,
            eventContent: ({event}) => event.id === '3' ? undefined : el => {
                el.innerHTML = `<i class="body">${event.title}</i>`;
                log.push('render ' + event.id);
                return () => log.push('destroy ' + event.id);
            }
        });
    }, EVENTS);

    await expect(page.locator('.body')).toHaveText(['Event 1', 'Event 2']);
    // The default content is still used when the function returns nothing
    await expect(page.locator('.ec-event-title')).toHaveText('Event 3');
    await page.evaluate(() => ec.removeEventById(1));
    await expect(page.locator('.body')).toHaveText(['Event 2']);
    await page.evaluate(() => EventCalendar.destroyCalendar(ec));
    await expect(page.locator('#ec')).toBeEmpty();
    expect(await page.evaluate(() => log)).toEqual(['render 1', 'render 2', 'destroy 1', 'destroy 2']);
});

for (let [view, plugin] of [
    ['dayGridMonth', 'DayGrid'],
    ['timeGridDay', 'TimeGrid'],
    ['resourceTimelineDay', 'ResourceTimeline']
]) {
    test(`${view} stacks events again when the content rendered by a function changes its height`, async ({page}) => {
        await openPage(page);
        await page.evaluate(([view, plugin, events]) => {
            let {createCalendar} = EventCalendar;
            createCalendar(document.getElementById('ec'), [EventCalendar[plugin]], {
                view,
                // With a fixed height the calendar itself does not change its size when the content does
                height: '600px',
                resources: [{id: 1}],
                events: events.map(event => ({...event, allDay: view === 'timeGridDay'})),
                eventContent: ({event}) => el => {
                    el.innerHTML = `<div class="body" style="height: 20px">${event.title}</div>`;
                }
            });
        }, [view, plugin, EVENTS]);

        await expect(page.locator('.body')).toHaveCount(3);
        await frames(page);
        expect(await overlaps(page)).toBe(0);
        await page.evaluate(() => document.querySelector('.body').style.height = '70px');
        await frames(page);
        expect(await overlaps(page)).toBe(0);
    });
}

test('setOption() without a value resets the option to its default', async ({page}) => {
    await openPage(page);
    await page.evaluate(events => {
        let {createCalendar, DayGrid, TimeGrid} = EventCalendar;
        window.ec = createCalendar(document.getElementById('ec'), [DayGrid, TimeGrid], {
            view: 'timeGridWeek',
            date: '2026-01-15',
            events,
            slotDuration: '01:00',
            eventContent: () => ({html: '<i class="body"></i>'}),
            theme: theme => ({...theme, event: 'ec-event custom'}),
            buttonText: {today: 'Now'},
            dayMaxEvents: true
        });
    }, EVENTS);

    let option = name => page.evaluate(name => ec.getOption(name), name);
    await expect(page.locator('.ec-day.ec-today')).toHaveCount(0);
    await page.evaluate(() => {
        for (let name of ['slotDuration', 'eventContent', 'theme', 'buttonText', 'dayMaxEvents', 'events', 'date']) {
            ec.setOption(name, undefined);
        }
    });
    expect((await option('slotDuration')).seconds).toBe(1800);
    expect(await option('eventContent')).toBeUndefined();
    expect((await option('theme')).event).toBe('ec-event');
    expect((await option('buttonText')).today).toBe('today');
    expect(await option('dayMaxEvents')).toBe(false);
    expect(await option('events')).toEqual([]);
    // Without a date it is today
    await expect(page.locator('.ec-day.ec-today').first()).toBeVisible();
    await expect(page.locator('.ec-toolbar .ec-today')).toHaveText('today');
    // The default of an option can be different in each view
    await page.evaluate(() => ec.setOption('view', 'dayGridMonth').setOption('dayHeaderFormat', {weekday: 'long'}));
    await expect(page.locator('.ec-col-head').first()).toHaveText('Sunday');
    await page.evaluate(() => ec.setOption('dayHeaderFormat', undefined));
    await expect(page.locator('.ec-col-head').first()).toHaveText('Sun');
    await page.evaluate(() => ec.setOption('view', 'timeGridWeek'));
    await expect(page.locator('.ec-col-head', {hasText: /^Mon, 10\/5$/})).toHaveCount(1);
    // The events set after the reset are not added to the default value
    await page.evaluate(() => {
        ec.addEvent({id: 9, start: '2026-10-08T01:00:00', end: '2026-10-08T02:00:00'});
        ec.setOption('events', undefined);
    });
    expect(await option('events')).toEqual([]);
});

test('setOptions() sets several options at once and resets the ones without a value', async ({page}) => {
    await openPage(page);
    await page.evaluate(events => {
        let {createCalendar, DayGrid, TimeGrid} = EventCalendar;
        window.ec = createCalendar(document.getElementById('ec'), [DayGrid, TimeGrid], {
            view: 'dayGridMonth', events, slotDuration: '01:00'
        });
    }, EVENTS);

    await expect(page.locator('.ec-day-grid .ec-event')).toHaveCount(3);
    let result = await page.evaluate(() => {
        let returned = ec.setOptions({view: 'timeGridDay', slotDuration: undefined, events: []});
        return [returned === ec, ec.getOption('view'), ec.getOption('slotDuration').seconds];
    });
    expect(result).toEqual([true, 'timeGridDay', 1800]);
    await expect(page.locator('.ec-time-grid')).toBeVisible();
    await expect(page.locator('.ec-event')).toHaveCount(0);
});
