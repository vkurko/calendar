import {test, expect, drag, center} from './fixtures.js';

async function open(page) {
    await page.goto('/tests/e2e/vue.html');
    await page.waitForFunction(() => window.ready);
}

// Two animation frames, so that everything scheduled before the paint is done
function frames(page) {
    return page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
}

// Number of pairs of visible events that overlap each other
function overlaps(page) {
    return page.evaluate(() => {
        let rects = [...document.querySelectorAll('.ec-event')]
            .filter(el => getComputedStyle(el).visibility !== 'hidden')
            .map(el => el.getBoundingClientRect());
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

// Events of the same day, so that they are stacked in dayGrid
const EVENTS = [1, 2, 3, 4].map(id => ({
    id, start: `2026-10-08T0${id}:00:00`, end: `2026-10-08T0${id + 1}:00:00`, title: 'Event ' + id
}));

test('renders slots inside the events and keeps what is provided by the parents', async ({page}) => {
    await open(page);
    await page.evaluate(events => {
        let {EventCalendar, DayGrid} = Adapter;
        let Body = {
            props: ['event'],
            setup(props) {
                let theme = Vue.inject('theme');
                return () => h('b', {class: 'body', 'data-theme': theme.value}, props.event.title);
            }
        };
        window.theme = Vue.ref('light');
        Vue.createApp({
            setup() {
                Vue.provide('theme', theme);
                return () => h(EventCalendar, {plugins: [DayGrid], view: 'dayGridMonth', events}, {
                    eventContent: ({event}) => h(Body, {event})
                });
            }
        }).mount('#root');
    }, EVENTS);

    await expect(page.locator('.ec-event-body > .body')).toHaveCount(4);
    await expect(page.locator('.body').first()).toHaveText('Event 1');
    await expect(page.locator('.body[data-theme=light]')).toHaveCount(4);
    await page.evaluate(() => theme.value = 'dark');
    await expect(page.locator('.body[data-theme=dark]')).toHaveCount(4);
});

test('stacks events with slots of different height, also when the height changes later', async ({page}) => {
    await open(page);
    await page.evaluate(events => {
        let {EventCalendar, DayGrid, ResourceTimeline} = Adapter;
        window.height = Vue.ref(20);
        window.render = view => Vue.createApp({
            // With a fixed height the calendar itself does not change its size when the content does
            render: () => h(EventCalendar, {
                plugins: [DayGrid, ResourceTimeline], view, events, resources: [{id: 1}], height: '600px'
            }, {
                eventContent: ({event}) => h('div', {
                    class: 'body', style: {height: (event.id === '1' ? height.value : 10 * event.id + 20) + 'px'}
                }, event.title)
            })
        }).mount('#root');
    }, EVENTS.map(event => ({...event, resourceId: 1, start: '2026-10-08T01:00:00'})));

    for (let view of ['dayGridMonth', 'resourceTimelineDay']) {
        await page.evaluate(view => {
            height.value = 20;
            render(view);
        }, view);
        await expect(page.locator('.body')).toHaveCount(4);
        await frames(page);
        expect(await overlaps(page)).toBe(0);
        await page.evaluate(() => height.value = 70);
        await frames(page);
        expect(await overlaps(page)).toBe(0);
        await page.evaluate(() => document.getElementById('root').replaceWith(
            Object.assign(document.createElement('div'), {id: 'root'})
        ));
    }
});

test('follows the changes of props, listeners and reactive objects', async ({page}) => {
    await open(page);
    await page.evaluate(events => {
        let {EventCalendar, TimeGrid} = Adapter;
        window.log = [];
        window.state = Vue.reactive({events, slotDuration: '01:00', count: 0});
        window.calendar = Vue.ref();
        Vue.createApp({
            render: () => h(EventCalendar, {
                ref: calendar,
                plugins: [TimeGrid],
                view: 'timeGridDay',
                events: state.events,
                'slot-duration': state.slotDuration,
                // A flag without a value
                'all-day-slot': '',
                // New listeners on each render
                onDatesSet: () => log.push('datesSet ' + state.count),
                onEventClick: () => log.push('click ' + state.count)
            })
        }).mount('#root');
    }, EVENTS);

    let option = name => page.evaluate(name => calendar.value.getOption(name), name);
    await expect(page.locator('.ec-event')).toHaveCount(4);
    expect((await option('slotDuration')).seconds).toBe(3600);
    expect(await option('allDaySlot')).toBe(true);
    await page.evaluate(() => state.slotDuration = '00:15');
    await frames(page);
    expect((await option('slotDuration')).seconds).toBe(900);
    // A reactive array is changed in place
    await page.evaluate(() => state.events.push(
        {id: 5, start: '2026-10-08T10:00:00', end: '2026-10-08T11:00:00', title: 'Event 5'}
    ));
    await expect(page.locator('.ec-event')).toHaveCount(5);
    await page.evaluate(() => state.events[4].title = 'Renamed');
    await expect(page.locator('.ec-event-title').nth(4)).toHaveText('Renamed');
    // Without a value the option goes back to its default
    await page.evaluate(() => state.slotDuration = undefined);
    await frames(page);
    expect((await option('slotDuration')).seconds).toBe(1800);
    // The calendar calls the new listeners and is not told about them
    await page.evaluate(() => state.count = 1);
    await frames(page);
    await page.locator('.ec-event').first().click();
    expect(await page.evaluate(() => log)).toEqual(['datesSet 0', 'click 1']);
});

test('accepts the options as an object and follows its changes', async ({page}) => {
    await open(page);
    await page.evaluate(events => {
        let {EventCalendar, DayGrid, TimeGrid} = Adapter;
        window.options = Vue.reactive({view: 'dayGridMonth', events});
        Vue.createApp({
            render: () => h(EventCalendar, {plugins: [DayGrid, TimeGrid], options})
        }).mount('#root');
    }, EVENTS);

    await expect(page.locator('.ec-day-grid .ec-event')).toHaveCount(4);
    await page.evaluate(() => options.view = 'timeGridDay');
    await expect(page.locator('.ec-time-grid .ec-event')).toHaveCount(4);
    await page.evaluate(() => options.events.pop());
    await expect(page.locator('.ec-time-grid .ec-event')).toHaveCount(3);
});

test('switches between the slot and the default content in the same elements', async ({page}) => {
    await open(page);
    await page.evaluate(events => {
        let {EventCalendar, DayGrid} = Adapter;
        window.custom = Vue.ref(true);
        Vue.createApp({
            render: () => h(EventCalendar, {plugins: [DayGrid], view: 'dayGridMonth', events}, custom.value ? {
                eventContent: ({event}) => h('i', {class: 'body'}, event.title)
            } : {})
        }).mount('#root');
    }, EVENTS);

    await expect(page.locator('.body')).toHaveCount(4);
    await page.evaluate(() => document.querySelectorAll('.ec-event-body').forEach(el => el.dataset.kept = ''));
    await page.evaluate(() => custom.value = false);
    await expect(page.locator('.ec-event-title')).toHaveCount(4);
    await expect(page.locator('.body')).toHaveCount(0);
    await page.evaluate(() => custom.value = true);
    await expect(page.locator('.body')).toHaveCount(4);
    await expect(page.locator('.ec-event-title')).toHaveCount(0);
    await expect(page.locator('.ec-event-body[data-kept]')).toHaveCount(4);
});

test('gives the methods of the calendar through the template ref and cleans up', async ({page}) => {
    await open(page);
    await page.evaluate(events => {
        let {EventCalendar, DayGrid} = Adapter;
        window.calendar = Vue.ref();
        window.shown = Vue.ref(true);
        Vue.createApp({
            render: () => shown.value ? h(EventCalendar, {
                ref: calendar, plugins: [DayGrid], view: 'dayGridMonth', events, class: 'wrapper', 'data-testid': 'calendar'
            }, {
                eventContent: ({event}) => h('i', {class: 'body'}, event.title)
            }) : null
        }).mount('#root');
    }, EVENTS);

    await expect(page.locator('.wrapper[data-testid=calendar] > .ec')).toHaveCount(1);
    await expect(page.locator('.body')).toHaveCount(4);
    expect(await page.evaluate(() => calendar.value.getEvents().length)).toBe(4);
    await page.evaluate(() => {
        calendar.value.addEvent({id: 5, start: '2026-10-09T10:00:00', end: '2026-10-09T11:00:00', title: 'Event 5'});
    });
    await expect(page.locator('.body')).toHaveCount(5);
    await page.evaluate(() => calendar.value.removeEventById(5));
    await expect(page.locator('.body')).toHaveCount(4);
    await page.evaluate(() => shown.value = false);
    await expect(page.locator('.ec')).toHaveCount(0);
    await expect(page.locator('.body')).toHaveCount(0);
});

test('renders the slots of the other content options and toolbar items', async ({page}) => {
    await open(page);
    await page.evaluate(() => {
        let {EventCalendar, DayGrid, List, ResourceTimeline, ResourceTimeGrid} = Adapter;
        window.clicks = 0;
        window.view = Vue.ref('dayGridMonth');
        let count = Vue.ref(0);
        Vue.createApp({
            render: () => h(EventCalendar, {
                plugins: [DayGrid, List, ResourceTimeline, ResourceTimeGrid], view: view.value,
                resources: [{id: 1, title: 'Resource'}],
                weekNumbers: true,
                headerToolbar: {start: 'title counter', center: 'plain', end: ''},
                customButtons: {plain: {text: 'Plain', click: () => ++clicks}}
            }, {
                customButtonCounter: () => h('button', {class: 'counter', onClick: () => ++count.value}, 'Count ' + count.value),
                dayCellContent: ({date}) => h('i', {class: 'day'}, date.getDate()),
                'week-number-content': ({week}) => h('i', {class: 'week'}, 'W' + week),
                noEventsContent: () => h('i', {class: 'empty'}, 'Nothing'),
                resourceLabelContent: ({resource}) => h('i', {class: 'label'}, resource.title),
                allDayContent: () => 'whole day'
            })
        }).mount('#root');
    });

    await expect(page.locator('.ec-day-head .day')).toHaveCount(35);
    await expect(page.locator('.ec-week-number .week').first()).toHaveText(/^W\d+$/);
    await page.locator('.counter').click();
    await expect(page.locator('.ec-counter .counter')).toHaveText('Count 1');
    await page.locator('.ec-plain').click();
    expect(await page.evaluate(() => clicks)).toBe(1);
    await page.evaluate(() => view.value = 'listWeek');
    await expect(page.locator('.empty')).toHaveText('Nothing');
    await page.evaluate(() => view.value = 'resourceTimelineWeek');
    await expect(page.locator('.label')).toHaveText('Resource');
    await page.evaluate(() => view.value = 'resourceTimeGridWeek');
    await expect(page.getByText('whole day')).toBeVisible();
    await expect(page.locator('.label').first()).toHaveText('Resource');
});

test('renders the slot of a toolbar item that is not listed in customButtons', async ({page}) => {
    await open(page);
    await page.evaluate(() => {
        let {EventCalendar, DayGrid} = Adapter;
        let query = Vue.ref('');
        Vue.createApp({
            render: () => h(EventCalendar, {plugins: [DayGrid], 'header-toolbar': {start: 'title', center: '', end: 'filter'}}, {
                customButtonFilter: () => [
                    h('input', {class: 'query', value: query.value, onInput: event => query.value = event.target.value}),
                    h('i', {class: 'echo'}, query.value)
                ]
            })
        }).mount('#root');
    });

    await page.locator('.ec-toolbar .ec-filter .query').pressSequentially('abc');
    await expect(page.locator('.echo')).toHaveText('abc');
    // The input is not rendered again while typing
    await expect(page.locator('.query')).toBeFocused();
});

test('drags an event with a slot', async ({page}) => {
    await open(page);
    await page.evaluate(events => {
        let {EventCalendar, DayGrid, Interaction} = Adapter;
        window.dropped = null;
        Vue.createApp({
            render: () => h(EventCalendar, {
                plugins: [DayGrid, Interaction], view: 'dayGridMonth', events: events.slice(0, 1), editable: '',
                onEventDrop: ({event}) => dropped = event.start.getDate()
            }, {
                eventContent: ({event}) => h('i', {class: 'body'}, event.title)
            })
        }).mount('#root');
    }, EVENTS);

    let event = page.locator('.ec-event');
    await expect(page.locator('.body')).toHaveCount(1);
    let from = center(await event.boundingBox());
    await drag(page, from, {x: from.x + (await page.locator('.ec-day').first().boundingBox()).width, y: from.y});
    expect(await page.evaluate(() => dropped)).toBe(9);
    await expect(page.locator('.body')).toHaveCount(1);
    await expect(page.locator('.body')).toHaveText('Event 1');
});
