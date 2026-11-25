import {test, expect, drag, center} from './fixtures.js';

async function open(page) {
    await page.goto('/tests/e2e/react.html');
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

test('renders React content inside the events and keeps the context', async ({page}) => {
    await open(page);
    await page.evaluate(events => {
        let {EventCalendar, DayGrid} = Adapter;
        let Theme = React.createContext('none');
        function Body({event}) {
            return h('b', {className: 'body', 'data-theme': React.useContext(Theme)}, event.title);
        }
        window.app = function App() {
            let [theme, setTheme] = React.useState('light');
            window.setTheme = setTheme;
            return h(Theme.Provider, {value: theme},
                h(EventCalendar, {plugins: [DayGrid], view: 'dayGridMonth', events, eventContent: arg => h(Body, arg)})
            );
        };
        createRoot(document.getElementById('root')).render(h(app));
    }, EVENTS);

    await expect(page.locator('.ec-event-body > .body')).toHaveCount(4);
    await expect(page.locator('.body').first()).toHaveText('Event 1');
    await expect(page.locator('.body[data-theme=light]')).toHaveCount(4);
    await page.evaluate(() => setTheme('dark'));
    await expect(page.locator('.body[data-theme=dark]')).toHaveCount(4);
});

test('stacks events with React content of different height', async ({page}) => {
    await open(page);
    await page.evaluate(events => {
        let {EventCalendar, DayGrid} = Adapter;
        createRoot(document.getElementById('root')).render(h(EventCalendar, {
            plugins: [DayGrid], view: 'dayGridMonth', events,
            eventContent: ({event}) => h('div', {style: {height: 10 * event.id + 20}}, event.title)
        }));
    }, EVENTS);

    await expect(page.locator('.ec-event')).toHaveCount(4);
    await frames(page);
    expect(await overlaps(page)).toBe(0);
});

test('stacks events again when React content changes its height later', async ({page}) => {
    await open(page);
    await page.evaluate(events => {
        let {EventCalendar, DayGrid, ResourceTimeline} = Adapter;
        function Body({event}) {
            let [height, setHeight] = React.useState(20);
            React.useEffect(() => {
                if (event.id === '1') {
                    window.grow = () => setHeight(60);
                }
            }, []);
            return h('div', {className: 'body', style: {height: event.id === '1' ? height : 20}}, event.title);
        }
        window.render = view => createRoot(document.getElementById('root')).render(h(EventCalendar, {
            // With a fixed height the calendar itself does not change its size when the content does
            plugins: [DayGrid, ResourceTimeline], view, events, height: '600px',
            resources: [{id: 1}],
            eventContent: arg => h(Body, arg)
        }));
    }, EVENTS.map(event => ({...event, resourceId: 1, start: '2026-10-08T01:00:00'})));

    for (let view of ['dayGridMonth', 'resourceTimelineDay']) {
        await page.evaluate(view => render(view), view);
        await expect(page.locator('.body')).toHaveCount(4);
        await frames(page);
        expect(await overlaps(page)).toBe(0);
        await page.evaluate(() => grow());
        await frames(page);
        expect(await overlaps(page)).toBe(0);
        await page.evaluate(() => document.getElementById('root').replaceWith(
            Object.assign(document.createElement('div'), {id: 'root'})
        ));
    }
});

test('does not touch the calendar when the parent re-renders with new functions and equal objects', async ({page}) => {
    await open(page);
    await page.evaluate(events => {
        let {EventCalendar, DayGrid} = Adapter;
        window.log = [];
        window.app = function App() {
            let [count, setCount] = React.useState(0);
            let ref = React.useRef(null);
            window.setCount = setCount;
            React.useEffect(() => {
                // Count the options set after the first render
                let calendar = ref.current;
                let setOption = calendar.setOption;
                calendar.setOption = function (name, value) {
                    log.push('set ' + name);
                    return setOption.call(this, name, value);
                };
            }, []);
            return h(EventCalendar, {
                ref,
                plugins: [DayGrid],
                view: 'dayGridMonth',
                // New objects and functions on each render
                events: events.map(event => ({...event})),
                headerToolbar: {start: 'title', center: '', end: 'today prev,next'},
                datesSet: () => log.push('datesSet ' + count),
                eventClick: () => log.push('click ' + count),
                eventContent: ({event}) => h('i', {className: 'body'}, event.title + ' / ' + count)
            });
        };
        createRoot(document.getElementById('root')).render(h(app));
    }, EVENTS);

    await expect(page.locator('.body').first()).toHaveText('Event 1 / 0');
    await page.evaluate(() => setCount(1));
    // The content is rendered by React with the new function
    await expect(page.locator('.body').first()).toHaveText('Event 1 / 1');
    // The calendar calls the new function
    await page.locator('.ec-event').first().click();
    expect(await page.evaluate(() => log)).toEqual(['datesSet 0', 'click 1']);
});

test('sets changed options and resets removed ones to their defaults', async ({page}) => {
    await open(page);
    await page.evaluate(events => {
        let {EventCalendar, TimeGrid} = Adapter;
        window.app = function App() {
            let [props, setProps] = React.useState({slotDuration: '01:00', eventContent: () => h('i', {className: 'body'})});
            window.setProps = setProps;
            window.calendar = React.useRef(null);
            return h(EventCalendar, {ref: calendar, plugins: [TimeGrid], view: 'timeGridDay', events, ...props});
        };
        createRoot(document.getElementById('root')).render(h(app));
    }, EVENTS);

    let slotDuration = () => page.evaluate(() => calendar.current.getOption('slotDuration').seconds);
    await expect(page.locator('.body')).toHaveCount(4);
    expect(await slotDuration()).toBe(3600);
    await page.evaluate(() => setProps({slotDuration: '00:15', eventContent: () => h('i', {className: 'body'})}));
    await expect(page.locator('.body')).toHaveCount(4);
    expect(await slotDuration()).toBe(900);
    // Without the props the calendar goes back to the defaults
    await page.evaluate(() => setProps({}));
    await expect(page.locator('.ec-event-title')).toHaveCount(4);
    await expect(page.locator('.body')).toHaveCount(0);
    expect(await slotDuration()).toBe(1800);
    await page.evaluate(() => setProps({slotDuration: '00:15'}));
    await page.evaluate(() => setProps({slotDuration: undefined}));
    await frames(page);
    expect(await slotDuration()).toBe(1800);
});

test('shows the default content when the function returns nothing', async ({page}) => {
    await open(page);
    await page.evaluate(events => {
        let {EventCalendar, DayGrid} = Adapter;
        window.app = function App() {
            let [custom, setCustom] = React.useState('1');
            window.setCustom = setCustom;
            return h(EventCalendar, {
                plugins: [DayGrid], view: 'dayGridMonth', events,
                eventContent: ({event}) => event.id === custom ? h('i', {className: 'body'}, event.title) : null
            });
        };
        createRoot(document.getElementById('root')).render(h(app));
    }, EVENTS);

    await expect(page.locator('.body')).toHaveText('Event 1');
    await expect(page.locator('.ec-event-title')).toHaveCount(3);
    await page.evaluate(() => document.querySelectorAll('.ec-event-body').forEach(el => el.dataset.kept = ''));
    // The same elements switch between the content of React and the content of the calendar
    await page.evaluate(() => setCustom('2'));
    await expect(page.locator('.body')).toHaveText('Event 2');
    await expect(page.locator('.ec-event-title')).toHaveCount(3);
    await expect(page.locator('.ec-event-title').first()).toHaveText('Event 1');
    await expect(page.locator('.ec-event-body').nth(1).locator('> *')).toHaveCount(1);
    await expect(page.locator('.ec-event-body[data-kept]')).toHaveCount(4);
});

test('switches to the default content in the same elements when the calendar asks for the content again', async ({page}) => {
    await open(page);
    await page.evaluate(events => {
        let {EventCalendar, DayGrid} = Adapter;
        window.custom = true;
        // The same function returns something else for the same events
        let eventContent = ({event}) => custom ? h('i', {className: 'body'}, event.title) : undefined;
        window.app = function App() {
            let [displayEventEnd, setDisplayEventEnd] = React.useState(false);
            window.setDisplayEventEnd = setDisplayEventEnd;
            return h(EventCalendar, {plugins: [DayGrid], view: 'dayGridMonth', events, eventContent, displayEventEnd});
        };
        createRoot(document.getElementById('root')).render(h(app));
    }, EVENTS);

    await expect(page.locator('.body')).toHaveCount(4);
    await page.evaluate(() => document.querySelectorAll('.ec-event-body').forEach(el => el.dataset.kept = ''));
    // The time text of the events changes, so the calendar asks for their content again
    await page.evaluate(() => {
        custom = false;
        setDisplayEventEnd(true);
    });
    await expect(page.locator('.ec-event-title')).toHaveCount(4);
    await expect(page.locator('.body')).toHaveCount(0);
    await page.evaluate(() => {
        custom = true;
        setDisplayEventEnd(false);
    });
    await expect(page.locator('.body')).toHaveCount(4);
    await expect(page.locator('.ec-event-title')).toHaveCount(0);
    await expect(page.locator('.ec-event-body[data-kept]')).toHaveCount(4);
});

test('gives the calendar through the ref and renders once in StrictMode', async ({page}) => {
    await open(page);
    await page.evaluate(events => {
        let {EventCalendar, DayGrid} = Adapter;
        window.app = function App() {
            let ref = React.useRef(null);
            window.calendar = ref;
            let [shown, setShown] = React.useState(true);
            window.setShown = setShown;
            return shown && h(EventCalendar, {
                ref, plugins: [DayGrid], view: 'dayGridMonth', events, className: 'wrapper', 'data-testid': 'calendar',
                eventContent: ({event}) => h('i', {className: 'body'}, event.title)
            });
        };
        createRoot(document.getElementById('root')).render(h(React.StrictMode, null, h(app)));
    }, EVENTS);

    await expect(page.locator('.wrapper[data-testid=calendar] > .ec')).toHaveCount(1);
    await expect(page.locator('.body')).toHaveCount(4);
    expect(await page.evaluate(() => calendar.current.getEvents().length)).toBe(4);
    await page.evaluate(() => {
        calendar.current.addEvent({id: 5, start: '2026-10-09T10:00:00', end: '2026-10-09T11:00:00', title: 'Event 5'});
    });
    await expect(page.locator('.body')).toHaveCount(5);
    await page.evaluate(() => calendar.current.removeEventById(5));
    await expect(page.locator('.body')).toHaveCount(4);
    await page.evaluate(() => setShown(false));
    await expect(page.locator('#root')).toBeEmpty();
    expect(await page.evaluate(() => calendar.current)).toBeNull();
});

test('renders React content for the other content options and toolbar items', async ({page}) => {
    await open(page);
    await page.evaluate(() => {
        let {EventCalendar, DayGrid, List, ResourceTimeline, ResourceTimeGrid} = Adapter;
        window.clicks = 0;
        window.app = function App() {
            let [view, setView] = React.useState('dayGridMonth');
            let [count, setCount] = React.useState(0);
            window.setView = setView;
            return h(EventCalendar, {
                plugins: [DayGrid, List, ResourceTimeline, ResourceTimeGrid], view,
                resources: [{id: 1, title: 'Resource'}],
                dayMaxEvents: true,
                weekNumbers: true,
                headerToolbar: {start: 'title counter', center: 'plain', end: ''},
                customButtons: {
                    counter: {content: h('button', {className: 'counter', onClick: () => setCount(count + 1)}, 'Count ' + count)},
                    plain: {text: 'Plain', click: () => ++clicks}
                },
                dayCellContent: ({date}) => h('i', {className: 'day'}, date.getDate()),
                weekNumberContent: ({week}) => h('i', {className: 'week'}, 'W' + week),
                noEventsContent: h('i', {className: 'empty'}, 'Nothing'),
                resourceLabelContent: ({resource}) => h('i', {className: 'label'}, resource.title),
                allDayContent: 'whole day'
            });
        };
        createRoot(document.getElementById('root')).render(h(app));
    });

    await expect(page.locator('.ec-day-head .day')).toHaveCount(35);
    await expect(page.locator('.ec-week-number .week').first()).toHaveText(/^W\d+$/);
    await page.locator('.counter').click();
    await expect(page.locator('.ec-counter .counter')).toHaveText('Count 1');
    await page.locator('.ec-plain').click();
    expect(await page.evaluate(() => clicks)).toBe(1);
    await page.evaluate(() => setView('listWeek'));
    await expect(page.locator('.empty')).toHaveText('Nothing');
    await page.evaluate(() => setView('resourceTimelineWeek'));
    await expect(page.locator('.label')).toHaveText('Resource');
    await page.evaluate(() => setView('resourceTimeGridWeek'));
    await expect(page.getByText('whole day')).toBeVisible();
    await expect(page.locator('.label').first()).toHaveText('Resource');
});

test('keeps the focus in a toolbar item while it changes the state of the parent', async ({page}) => {
    await open(page);
    await page.evaluate(() => {
        let {EventCalendar, DayGrid} = Adapter;
        window.app = function App() {
            let [query, setQuery] = React.useState('');
            return h(EventCalendar, {
                plugins: [DayGrid],
                headerToolbar: {start: 'title', center: '', end: 'filter'},
                customButtons: {filter: {content: [
                    h('input', {key: 1, className: 'query', value: query, onChange: event => setQuery(event.target.value)}),
                    h('i', {key: 2, className: 'echo'}, query)
                ]}}
            });
        };
        createRoot(document.getElementById('root')).render(h(app));
    });

    await page.locator('.ec-toolbar .ec-filter .query').pressSequentially('abc');
    await expect(page.locator('.echo')).toHaveText('abc');
    // The input is not rendered again while typing
    await expect(page.locator('.query')).toBeFocused();
});

test('drags an event with React content', async ({page}) => {
    await open(page);
    await page.evaluate(events => {
        let {EventCalendar, DayGrid, Interaction} = Adapter;
        window.dropped = null;
        createRoot(document.getElementById('root')).render(h(EventCalendar, {
            plugins: [DayGrid, Interaction], view: 'dayGridMonth', events: events.slice(0, 1), editable: true,
            eventContent: ({event}) => h('i', {className: 'body'}, event.title),
            eventDrop: ({event}) => dropped = event.start.getDate()
        }));
    }, EVENTS);

    let event = page.locator('.ec-event');
    await expect(page.locator('.body')).toHaveCount(1);
    let from = center(await event.boundingBox());
    await drag(page, from, {x: from.x + (await page.locator('.ec-day').first().boundingBox()).width, y: from.y});
    expect(await page.evaluate(() => dropped)).toBe(9);
    await expect(page.locator('.body')).toHaveCount(1);
    await expect(page.locator('.body')).toHaveText('Event 1');
});
