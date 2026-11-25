import {test, expect, drag, center} from './fixtures.js';

async function open(page) {
    await page.goto('/tests/e2e/angular.html');
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

test('renders templates inside the events with the components and the injector of the parent', async ({page}) => {
    await open(page);
    await page.evaluate(async events => {
        let {DayGrid} = Adapter;
        let THEME = new core.InjectionToken('theme');
        // The components of the tests are compiled in the browser, where only the classic inputs and queries work
        let Body = core.Component({
            selector: 'app-body',
            inputs: ['title'],
            template: '<b class="body" [attr.data-theme]="theme()">{{ title }}</b>'
        })(class {
            theme = core.inject(THEME);
        });
        await bootstrap(class {
            static component = {
                imports: [Adapter.EventCalendar, Adapter.EcContent, Body],
                providers: [{provide: THEME, useValue: window.theme = core.signal('light')}],
                template: `
                    <event-calendar [plugins]="plugins" [options]="options">
                        <ng-template ecContent="eventContent" let-event="event">
                            <app-body [title]="event.title"/>
                        </ng-template>
                    </event-calendar>`
            };
            plugins = [DayGrid];
            options = {view: 'dayGridMonth', events};
        });
    }, EVENTS);

    await expect(page.locator('.ec-event-body > app-body > .body')).toHaveCount(4);
    await expect(page.locator('.body').first()).toHaveText('Event 1');
    await expect(page.locator('.body[data-theme=light]')).toHaveCount(4);
    await page.evaluate(() => theme.set('dark'));
    await expect(page.locator('.body[data-theme=dark]')).toHaveCount(4);
});

test('stacks events with templates of different height, also when the height changes later', async ({page}) => {
    await open(page);
    await page.evaluate(events => {
        let {DayGrid, ResourceTimeline} = Adapter;
        window.render = view => bootstrap(class {
            static component = {
                template: `
                    <event-calendar [plugins]="plugins" [options]="options">
                        <ng-template ecContent="eventContent" let-event="event">
                            <div class="body" [style.height.px]="event.id === '1' ? height() : 10 * event.id + 20">
                                {{ event.title }}
                            </div>
                        </ng-template>
                    </event-calendar>`
            };
            plugins = [DayGrid, ResourceTimeline];
            // With a fixed height the calendar itself does not change its size when the content does
            options = {view, events, resources: [{id: 1}], height: '600px'};
            height = window.height = core.signal(20);
        });
    }, EVENTS.map(event => ({...event, resourceId: 1, start: '2026-10-08T01:00:00'})));

    for (let view of ['dayGridMonth', 'resourceTimelineDay']) {
        await page.evaluate(view => render(view), view);
        await expect(page.locator('.body')).toHaveCount(4);
        await frames(page);
        expect(await overlaps(page)).toBe(0);
        await page.evaluate(() => height.set(70));
        await frames(page);
        expect(await overlaps(page)).toBe(0);
    }
});

test('follows the changes of the options and calls the current callbacks', async ({page}) => {
    await open(page);
    await page.evaluate(async events => {
        let {TimeGrid} = Adapter;
        window.log = [];
        // The component of the calendar, found with the debugging tools of Angular
        window.calendar = () => ng.getComponent(document.querySelector('event-calendar'));
        await bootstrap(class {
            static component = {
                template: '<event-calendar #calendar [plugins]="plugins" [options]="options()"/>'
            };
            plugins = [TimeGrid];
            count = 0;
            options = core.signal(this.create({slotDuration: '01:00'}));
            constructor() {
                window.app = this;
            }
            // New callbacks on each change
            create(options) {
                let count = this.count++;
                return {
                    view: 'timeGridDay',
                    events,
                    datesSet: () => log.push('datesSet ' + count),
                    eventClick: () => log.push('click ' + count),
                    ...options
                };
            }
        });
    }, EVENTS);

    let option = name => page.evaluate(name => calendar().getOption(name), name);
    await expect(page.locator('.ec-event')).toHaveCount(4);
    expect((await option('slotDuration')).seconds).toBe(3600);
    await page.evaluate(() => app.options.set(app.create({slotDuration: '00:15'})));
    await frames(page);
    expect((await option('slotDuration')).seconds).toBe(900);
    // Without the option it goes back to its default
    await page.evaluate(() => app.options.set(app.create({events: []})));
    await expect(page.locator('.ec-event')).toHaveCount(0);
    expect((await option('slotDuration')).seconds).toBe(1800);
    await page.evaluate(events => app.options.set(app.create({events})), EVENTS);
    // The calendar calls the new callbacks and is not told about them
    await page.locator('.ec-event').first().click();
    expect(await page.evaluate(() => log)).toEqual(['datesSet 0', 'click 3']);
});

test('switches between the template and the default content in the same elements', async ({page}) => {
    await open(page);
    await page.evaluate(async events => {
        let {DayGrid} = Adapter;
        await bootstrap(class {
            static component = {
                template: `
                    <event-calendar [plugins]="plugins" [options]="options">
                        @if (custom()) {
                            <ng-template ecContent="eventContent" let-event="event">
                                <i class="body">{{ event.title }}</i>
                            </ng-template>
                        }
                    </event-calendar>`
            };
            plugins = [DayGrid];
            options = {view: 'dayGridMonth', events};
            custom = window.custom = core.signal(true);
        });
    }, EVENTS);

    await expect(page.locator('.body')).toHaveCount(4);
    await page.evaluate(() => document.querySelectorAll('.ec-event-body').forEach(el => el.dataset.kept = ''));
    await page.evaluate(() => custom.set(false));
    await expect(page.locator('.ec-event-title')).toHaveCount(4);
    await expect(page.locator('.body')).toHaveCount(0);
    await page.evaluate(() => custom.set(true));
    await expect(page.locator('.body')).toHaveCount(4);
    await expect(page.locator('.ec-event-title')).toHaveCount(0);
    await expect(page.locator('.ec-event-body[data-kept]')).toHaveCount(4);
});

test('gives the methods of the calendar and cleans up', async ({page}) => {
    await open(page);
    await page.evaluate(async events => {
        let {DayGrid} = Adapter;
        window.calendar = () => ng.getComponent(document.querySelector('event-calendar'));
        await bootstrap(class {
            static component = {
                template: `
                    @if (shown()) {
                        <event-calendar #calendar class="wrapper" [plugins]="plugins" [options]="options">
                            <ng-template ecContent="eventContent" let-event="event">
                                <i class="body">{{ event.title }}</i>
                            </ng-template>
                        </event-calendar>
                        <button class="next" (click)="calendar.next()">next</button>
                    }`
            };
            plugins = [DayGrid];
            options = {view: 'dayGridMonth', events};
            shown = window.shown = core.signal(true);
            constructor() {
                window.app = this;
            }
        });
    }, EVENTS);

    await expect(page.locator('event-calendar.wrapper > .ec')).toHaveCount(1);
    await expect(page.locator('.body')).toHaveCount(4);
    expect(await page.evaluate(() => calendar().getEvents().length)).toBe(4);
    await page.evaluate(() => {
        calendar().addEvent({id: 5, start: '2026-10-09T10:00:00', end: '2026-10-09T11:00:00', title: 'Event 5'});
    });
    await expect(page.locator('.body')).toHaveCount(5);
    await page.evaluate(() => calendar().removeEventById(5));
    await expect(page.locator('.body')).toHaveCount(4);
    // The methods can be used in the templates
    let title = await page.locator('.ec-title').textContent();
    await page.locator('.next').click();
    await expect(page.locator('.ec-title')).not.toHaveText(title);
    await page.evaluate(() => shown.set(false));
    await expect(page.locator('.ec')).toHaveCount(0);
    await expect(page.locator('.body')).toHaveCount(0);
});

test('renders the templates of the other content options and toolbar items', async ({page}) => {
    await open(page);
    await page.evaluate(async () => {
        let {DayGrid, List, ResourceTimeline, ResourceTimeGrid} = Adapter;
        window.clicks = 0;
        await bootstrap(class {
            static component = {
                template: `
                    <event-calendar [plugins]="plugins" [options]="options()">
                        <ng-template ecContent="customButtonCounter">
                            <button class="counter" (click)="count.set(count() + 1)">Count {{ count() }}</button>
                        </ng-template>
                        <ng-template ecContent="dayCellContent" let-date="date">
                            <i class="day">{{ date.getDate() }}</i>
                        </ng-template>
                        <ng-template ecContent="weekNumberContent" let-arg><i class="week">W{{ arg.week }}</i></ng-template>
                        <ng-template ecContent="noEventsContent"><i class="empty">Nothing</i></ng-template>
                        <ng-template ecContent="resourceLabelContent" let-resource="resource">
                            <i class="label">{{ resource.title }}</i>
                        </ng-template>
                        <ng-template ecContent="allDayContent">whole day</ng-template>
                    </event-calendar>`
            };
            plugins = [DayGrid, List, ResourceTimeline, ResourceTimeGrid];
            count = core.signal(0);
            view = window.view = core.signal('dayGridMonth');
            options = core.computed(() => ({
                view: this.view(),
                resources: [{id: 1, title: 'Resource'}],
                weekNumbers: true,
                headerToolbar: {start: 'title counter', center: 'plain', end: ''},
                customButtons: {plain: {text: 'Plain', click: () => ++clicks}}
            }));
        });
    });

    await expect(page.locator('.ec-day-head .day')).toHaveCount(35);
    await expect(page.locator('.ec-week-number .week').first()).toHaveText(/^W\d+$/);
    await page.locator('.counter').click();
    await expect(page.locator('.ec-counter .counter')).toHaveText('Count 1');
    await page.locator('.ec-plain').click();
    expect(await page.evaluate(() => clicks)).toBe(1);
    await page.evaluate(() => view.set('listWeek'));
    await expect(page.locator('.empty')).toHaveText('Nothing');
    await page.evaluate(() => view.set('resourceTimelineWeek'));
    await expect(page.locator('.label')).toHaveText('Resource');
    await page.evaluate(() => view.set('resourceTimeGridWeek'));
    await expect(page.getByText('whole day')).toBeVisible();
    await expect(page.locator('.label').first()).toHaveText('Resource');
});

test('renders the template of a toolbar item that is not listed in customButtons', async ({page}) => {
    await open(page);
    await page.evaluate(async () => {
        let {DayGrid} = Adapter;
        await bootstrap(class {
            static component = {
                template: `
                    <event-calendar [plugins]="plugins" [options]="options">
                        <ng-template ecContent="customButtonFilter">
                            <input class="query" [value]="query()" (input)="query.set($any($event.target).value)">
                            <i class="echo">{{ query() }}</i>
                        </ng-template>
                    </event-calendar>`
            };
            plugins = [DayGrid];
            options = {headerToolbar: {start: 'title', center: '', end: 'filter'}};
            query = core.signal('');
        });
    });

    await page.locator('.ec-toolbar .ec-filter .query').pressSequentially('abc');
    await expect(page.locator('.echo')).toHaveText('abc');
    // The input is not rendered again while typing
    await expect(page.locator('.query')).toBeFocused();
});

test('drags an event with a template', async ({page}) => {
    await open(page);
    await page.evaluate(async events => {
        let {DayGrid, Interaction} = Adapter;
        window.dropped = null;
        await bootstrap(class {
            static component = {
                template: `
                    <event-calendar [plugins]="plugins" [options]="options">
                        <ng-template ecContent="eventContent" let-event="event"><i class="body">{{ event.title }}</i></ng-template>
                    </event-calendar>`
            };
            plugins = [DayGrid, Interaction];
            options = {
                view: 'dayGridMonth', events: events.slice(0, 1), editable: true,
                eventDrop: ({event}) => dropped = event.start.getDate()
            };
        });
    }, EVENTS);

    let event = page.locator('.ec-event');
    await expect(page.locator('.body')).toHaveCount(1);
    let from = center(await event.boundingBox());
    await drag(page, from, {x: from.x + (await page.locator('.ec-day').first().boundingBox()).width, y: from.y});
    expect(await page.evaluate(() => dropped)).toBe(9);
    await expect(page.locator('.body')).toHaveCount(1);
    await expect(page.locator('.body')).toHaveText('Event 1');
});
