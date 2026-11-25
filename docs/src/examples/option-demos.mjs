/**
 * The demos on the pages of the options. A demo is a calendar where the value of the option is switched live.
 *
 *   base     — the options of the calendar, a function of the same context as in the examples,
 *   values   — the values to switch between, the first one is set initially; a value can be given as
 *              {label, value}, and the list can be a function of the context,
 *   callback — the option is a callback: its calls are logged,
 *   remount  — the option is only read when the calendar is created, so the calendar is created again,
 *   note     — what to do in the demo,
 *   height   — the height of the calendar, when the standard one of the demos does not fit.
 */
import {contentFunction} from './content-examples.mjs';

const week = ({events}) => ({view: 'timeGridWeek', scrollTime: '08:00', events});
const month = ({events}) => ({view: 'dayGridMonth', events});
const MONTH_HEIGHT = '680px';
const day = ({events}) => ({view: 'timeGridDay', scrollTime: '08:00', events});
const list = ({events}) => ({view: 'listWeek', events});
const columns = ({events, resources}) => ({view: 'resourceTimeGridDay', scrollTime: '08:00', resources, events});
const timeline = ({events, resources}) => ({
    view: 'resourceTimelineWeek', slotMinTime: '08:00', slotMaxTime: '20:00', slotDuration: '01:00', slotWidth: 72,
    resources, events
});
// Events without their own colors, for the options that set the colors
const plain = ({events}) => ({
    view: 'timeGridWeek', scrollTime: '08:00', events: events.map(({color, ...event}) => event)
});
const editable = context => ({...week(context), editable: true});
const selectable = context => ({...week(context), selectable: true});
const nested = [
    {id: 10, title: 'First floor', children: [{id: 1, title: 'Room A'}, {id: 2, title: 'Room B'}]},
    {id: 20, title: 'Second floor', children: [{id: 3, title: 'Room C'}]}
];
const nestedTimeline = context => ({...timeline(context), resources: nested});
const custom = (value, label = 'custom') => ({label, value});
const standard = {label: 'default', value: undefined};

export const optionDemos = {
    allDayContent: {base: week, values: [standard, custom(contentFunction('allDayContent'))]},
    allDaySlot: {base: week, values: [true, false]},
    buttonText: {base: week, values: [standard, custom(text => ({...text, today: 'This week'}))]},
    columnWidth: {
        base: ({events, resources}) => ({
            view: 'resourceTimeGridWeek', duration: {days: 3}, scrollTime: '08:00', resources: resources.slice(0, 2), events
        }),
        values: [undefined, '60px', '220px']
    },
    customButtons: {
        base: context => ({
            ...week(context),
            headerToolbar: {start: 'title', center: '', end: 'hello today prev,next'},
            customButtons: {hello: {text: 'Say hello', click: () => context.log('click', 'Hello!')}}
        }),
        logs: true,
        note: 'Press “Say hello”.'
    },
    customScrollbars: {base: timeline, values: [false, true]},
    date: {
        height: MONTH_HEIGHT,
        base: month,
        values: ({today, addDays}) => [
            {label: 'today', value: today},
            {label: 'in a month', value: addDays(today, 30)},
            {label: 'a month ago', value: addDays(today, -30)}
        ]
    },
    dateClick: {base: week, callback: true, note: 'Click an empty slot.'},
    dateIncrement: {base: week, values: [standard, {weeks: 2}, {months: 1}], note: 'Press the next button to see the step.'},
    datesAboveResources: {
        // The columns keep a readable width, and the calendar is scrolled horizontally
        base: ({events, resources}) => ({
            view: 'resourceTimeGridWeek', columnWidth: '110px', scrollTime: '08:00', resources, events
        }),
        values: [false, true]
    },
    datesSet: {base: week, callback: true, note: 'Navigate with the buttons.'},
    dayCellContent: {
        height: MONTH_HEIGHT,
        base: month,
        values: [standard, custom(contentFunction('dayCellContent'))]
    },
    dayCellFormat: {height: MONTH_HEIGHT, base: month, values: [{day: 'numeric'}, {day: '2-digit'}, {month: 'short', day: 'numeric'}]},
    dayHeaderFormat: {
        base: week,
        values: [{weekday: 'short', month: 'numeric', day: 'numeric'}, {weekday: 'long'}, {weekday: 'narrow', day: 'numeric'}]
    },
    dayMaxEvents: {height: MONTH_HEIGHT, base: month, values: [false, true]},
    dayPopoverFormat: {
        height: MONTH_HEIGHT,
        base: context => ({...month(context), dayMaxEvents: true}),
        values: [{month: 'long', day: 'numeric', year: 'numeric'}, {weekday: 'long', day: 'numeric'}],
        note: 'Click a “+more” link to see the title of the popup.'
    },
    displayEventEnd: {base: week, values: [true, false]},
    dragConstraint: {
        base: context => ({...editable(context), dragConstraint: ({event}) => ![0, 6].includes(event.start.getDay())}),
        note: 'An event cannot be dropped into the weekend.'
    },
    dragScroll: {
        base: context => ({...editable(context), height: '320px'}),
        values: [true, false],
        note: 'Drag an event to the bottom edge.'
    },
    duration: {base: week, values: [{weeks: 1}, {days: 3}, {weeks: 2}]},
    // The option decides only when the more specific ones are not set
    editable: {
        base: context => ({...week(context), eventStartEditable: null, eventDurationEditable: null}),
        values: [true, false],
        note: 'Try to drag or resize an event.'
    },
    events: {base: week, values: ({events}) => [{label: 'sample events', value: events}, {label: 'no events', value: []}]},
    eventAllUpdated: {base: week, callback: true, note: 'Navigate with the buttons.'},
    eventBackgroundColor: {base: plain, values: [undefined, '#0ea5e9', '#f43f5e']},
    eventClassNames: {base: week, values: [undefined, 'demo-striped', ({event}) => event.allDay ? 'demo-striped' : '']},
    eventClick: {base: week, callback: true, note: 'Click an event.'},
    eventColor: {base: plain, values: [undefined, '#10b981', '#8b5cf6']},
    eventContent: {
        base: ({events}) => ({view: 'timeGridWeek', scrollTime: '08:00', events: events.filter(event => !event.allDay)}),
        values: [standard, custom(contentFunction('eventContent'))]
    },
    eventDidMount: {base: month, callback: true},
    eventDragMinDistance: {base: editable, values: [5, 60], note: 'Drag an event: it starts to move after this many pixels.'},
    eventDragStart: {base: editable, callback: true, note: 'Drag an event.'},
    eventDragStop: {base: editable, callback: true, note: 'Drag an event.'},
    eventDrop: {base: editable, callback: true, note: 'Drag an event to another time.'},
    eventDurationEditable: {base: editable, values: [true, false], note: 'Try to resize an event.'},
    eventFilter: {
        base: week,
        values: [
            {label: 'all events', value: undefined},
            {label: 'before noon', value: ({event}) => !event.allDay && event.start.getHours() < 12},
            {label: 'all-day only', value: ({event}) => event.allDay}
        ]
    },
    eventGap: {height: MONTH_HEIGHT, base: month, values: [1, 4, 8]},
    eventMouseEnter: {base: week, callback: true, note: 'Move the mouse over an event.'},
    eventMouseLeave: {base: week, callback: true, note: 'Move the mouse over an event and away.'},
    eventOrder: {
        height: MONTH_HEIGHT,
        base: month,
        values: [standard, {label: 'by title', value: (a, b) => a.title.localeCompare(b.title)}]
    },
    eventResizableFromStart: {base: editable, values: [false, true], note: 'Drag the top edge of an event.'},
    eventResize: {base: editable, callback: true, note: 'Drag the bottom edge of an event.'},
    eventResizeStart: {base: editable, callback: true, note: 'Drag the bottom edge of an event.'},
    eventResizeStop: {base: editable, callback: true, note: 'Drag the bottom edge of an event.'},
    eventSources: {
        base: ({events, log}) => ({
            view: 'timeGridWeek', scrollTime: '08:00',
            eventSources: [{events: () => new Promise(resolve => setTimeout(() => resolve(events), 700))}],
            loading: isLoading => log('loading', isLoading)
        }),
        logs: true,
        note: 'The events are loaded again for each period you navigate to.'
    },
    eventStartEditable: {base: editable, values: [true, false], note: 'Try to drag an event.'},
    eventTimeFormat: {
        base: week,
        values: [{hour: 'numeric', minute: '2-digit'}, {hour: '2-digit', minute: '2-digit', hour12: false}]
    },
    eventTextColor: {base: plain, values: [undefined, '#fde047', '#0f172a']},
    filterEventsWithResources: {
        base: context => ({...week(context), resources: [{id: 1, title: 'Room A'}]}),
        values: [false, true],
        note: 'The calendar has one resource, Room A.'
    },
    filterResourcesWithEvents: {
        base: context => ({...columns(context), resources: [...context.resources, {id: 4, title: 'Room D (free)'}]}),
        values: [false, true]
    },
    firstDay: {height: MONTH_HEIGHT, base: month, values: [{label: '0 (Sunday)', value: 0}, {label: '1 (Monday)', value: 1}, {label: '6 (Saturday)', value: 6}]},
    flexibleSlotTimeLimits: {
        base: context => ({...week(context), slotMinTime: '10:00', slotMaxTime: '15:00'}),
        values: [false, true]
    },
    headerToolbar: {
        base: context => ({...month(context), view: 'timeGridWeek', scrollTime: '08:00'}),
        values: [
            {start: 'title', center: '', end: 'today prev,next'},
            {start: 'prev,next', center: 'title', end: 'dayGridMonth,timeGridWeek,timeGridDay'},
            {start: '', center: 'prev title next', end: ''}
        ]
    },
    height: {base: week, values: ['440px', '300px', 'auto'], fit: true},
    hiddenDays: {base: week, values: [[], [0, 6], [1, 3, 5]]},
    highlightedDates: {
        height: MONTH_HEIGHT,
        base: month,
        values: ({today, addDays}) => [
            {label: 'three dates', value: [addDays(today, 2), addDays(today, 3), addDays(today, 9)]},
            {label: 'none', value: []}
        ]
    },
    icons: {
        base: nestedTimeline,
        values: [standard, custom(icons => ({...icons, collapse: {html: '▾'}, expand: {html: '▸'}}))]
    },
    listDayFormat: {base: list, values: [{weekday: 'long'}, {weekday: 'short', day: 'numeric'}]},
    listDaySideFormat: {
        base: list,
        values: [{year: 'numeric', month: 'long', day: 'numeric'}, {month: 'short', day: 'numeric'}]
    },
    loading: {
        base: ({events}) => ({
            view: 'timeGridWeek', scrollTime: '08:00',
            eventSources: [{events: () => new Promise(resolve => setTimeout(() => resolve(events), 700))}]
        }),
        callback: true,
        note: 'Navigate with the buttons.'
    },
    locale: {base: week, values: ['en', 'de', 'fr', 'ja', 'ar']},
    monthHeaderFormat: {
        base: ({events, resources}) => ({view: 'resourceTimelineYear', resources, events}),
        values: [{month: 'long'}, {month: 'short', year: 'numeric'}]
    },
    moreLinkContent: {
        height: MONTH_HEIGHT,
        base: context => ({...month(context), dayMaxEvents: true}),
        values: [standard, custom(contentFunction('moreLinkContent'))]
    },
    noEventsClick: {base: () => ({view: 'listWeek', events: []}), callback: true, note: 'Click the empty list.'},
    noEventsContent: {
        base: () => ({view: 'listWeek', events: []}),
        values: [standard, custom(contentFunction('noEventsContent'))]
    },
    nowIndicator: {base: week, values: [true, false]},
    pointer: {base: week, values: [true, false], note: 'Move the mouse over the slots to see the highlight.'},
    resizeConstraint: {
        base: context => ({...editable(context), resizeConstraint: ({event}) => event.end - event.start <= 3 * 3600000}),
        note: 'An event cannot be made longer than 3 hours.'
    },
    resourceExpand: {base: nestedTimeline, callback: true, note: 'Collapse and expand a floor.'},
    resources: {
        base: timeline,
        values: ({resources}) => [{label: 'three rooms', value: resources}, {label: 'nested', value: nested}]
    },
    resourcesInitiallyExpanded: {base: nestedTimeline, values: [true, false], remount: true},
    resourceLabelContent: {
        base: timeline,
        values: [standard, custom(contentFunction('resourceLabelContent'))]
    },
    scrollTime: {base: ({events}) => ({view: 'timeGridWeek', events}), values: ['08:00', '14:00', '00:00']},
    select: {base: selectable, callback: true, note: 'Drag over the empty slots.'},
    selectable: {base: week, values: [true, false], note: 'Try to select a range: drag over the empty slots.'},
    selectConstraint: {
        base: context => ({...selectable(context), selectConstraint: ({start}) => ![0, 6].includes(start.getDay())}),
        note: 'A selection cannot start on the weekend.'
    },
    selectBackgroundColor: {base: selectable, values: [undefined, '#fda4af', '#93c5fd'], note: 'Drag over the empty slots to see the color of the selection.'},
    selectMinDistance: {base: selectable, values: [0, 60], note: 'Drag over the empty slots: the selection starts after this many pixels.'},
    slotDuration: {base: week, values: ['00:30', '00:15', '01:00'], remount: true},
    slotEventOverlap: {
        base: ({events, today}) => ({
            view: 'timeGridDay', scrollTime: '08:00',
            events: events.filter(event => !event.allDay).map(event => ({
                ...event,
                start: new Date(today.getFullYear(), today.getMonth(), today.getDate(), event.start.getHours(), event.start.getMinutes()),
                end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), event.end.getHours(), event.end.getMinutes())
            }))
        }),
        values: [true, false]
    },
    slotHeight: {base: week, values: [24, 16, 40], remount: true},
    slotLabelFormat: {
        base: week,
        values: [{hour: 'numeric', minute: '2-digit'}, {hour: '2-digit', minute: '2-digit', hour12: false}, {hour: 'numeric'}]
    },
    slotLabelInterval: {base: week, values: [undefined, '00:30', '02:00'], remount: true},
    // Scrolled to the evening, where the end of the day is
    slotMaxTime: {
        base: ({events}) => ({view: 'timeGridWeek', scrollTime: '14:00', events}),
        values: ['24:00', '18:00', '20:00'],
        remount: true
    },
    slotMinTime: {base: ({events}) => ({view: 'timeGridWeek', scrollTime: '00:00', events}), values: ['00:00', '08:00', '10:00'], remount: true},
    slotWidth: {
        base: ({events, resources}) => ({view: 'resourceTimelineDay', scrollTime: '08:00', resources, events}),
        values: [32, 20, 64],
        remount: true
    },
    snapDuration: {base: editable, values: [undefined, '00:05', '01:00'], note: 'Drag an event and watch its time.'},
    timeZone: {
        base: ({events}) => ({
            view: 'timeGridWeek', scrollTime: '08:00', nowIndicator: true,
            events: events.filter(event => !event.allDay).map(event => ({
                ...event, start: event.start.toISOString(), end: event.end.toISOString()
            }))
        }),
        values: ['local', 'UTC', 'America/New_York', 'Asia/Tokyo']
    },
    titleFormat: {
        base: week,
        values: [{year: 'numeric', month: 'short', day: 'numeric'}, {year: 'numeric', month: 'long'}, {month: 'numeric', day: 'numeric'}]
    },
    unselect: {base: selectable, callback: true, note: 'Select a range, then click outside of it.'},
    unselectAuto: {base: selectable, values: [true, false], note: 'Select a range, then click outside of the calendar.'},
    validRange: {
        height: MONTH_HEIGHT,
        base: month,
        values: ({today, addDays}) => [
            {label: 'three weeks around today', value: {start: addDays(today, -7), end: addDays(today, 14)}},
            {label: 'no limits', value: undefined}
        ],
        note: 'Navigate with the buttons.'
    },
    view: {
        base: ({events, resources}) => ({scrollTime: '08:00', resources, events}),
        values: ['timeGridWeek', 'dayGridMonth', 'timeGridDay', 'listWeek', 'resourceTimeGridDay', 'resourceTimelineWeek']
    },
    viewDidMount: {
        base: context => ({
            ...week(context),
            headerToolbar: {start: 'title', center: '', end: 'dayGridMonth,timeGridWeek,timeGridDay'},
            buttonText: text => ({...text, dayGridMonth: 'Month', timeGridWeek: 'Week', timeGridDay: 'Day'})
        }),
        callback: true,
        note: 'Switch the view.'
    },
    views: {
        base: context => ({
            ...week(context),
            view: 'timeGridFourDay',
            views: {timeGridFourDay: {type: 'timeGridWeek', duration: {days: 4}}},
            buttonText: text => ({...text, today: 'Today', timeGridFourDay: '4 days', timeGridWeek: 'Week'}),
            headerToolbar: {start: 'title', center: '', end: 'timeGridFourDay,timeGridWeek today prev,next'}
        }),
        note: 'A custom view of four days next to the standard week.'
    },
    weekNumberContent: {
        height: MONTH_HEIGHT,
        base: context => ({...month(context), weekNumbers: true}),
        values: [standard, custom(contentFunction('weekNumberContent'))]
    },
    weekNumbers: {height: MONTH_HEIGHT, base: month, values: [false, true]},
};
