/**
 * The demos on the pages of the methods: a calendar and buttons that call the method.
 * `label` is the call as it is written in the code, `run` makes it and returns what has to be logged.
 */
const week = ({events}) => ({view: 'timeGridWeek', scrollTime: '08:00', events});

export const methodDemos = {
    getOption: {
        base: week,
        actions: [
            {label: "ec.getOption('view')", run: ec => ec.getOption('view')},
            {label: "ec.getOption('date')", run: ec => ec.getOption('date')},
            {label: "ec.getOption('slotDuration')", run: ec => ec.getOption('slotDuration')}
        ]
    },
    setOption: {
        base: week,
        actions: [
            {label: "ec.setOption('view', 'dayGridMonth')", run: ec => void ec.setOption('view', 'dayGridMonth')},
            {label: "ec.setOption('view', 'timeGridWeek')", run: ec => void ec.setOption('view', 'timeGridWeek')},
            {label: "ec.setOption('slotDuration', '00:15')", run: ec => void ec.setOption('slotDuration', '00:15')},
            {label: "ec.setOption('slotDuration', undefined)", run: ec => void ec.setOption('slotDuration', undefined)}
        ]
    },
    setOptions: {
        base: week,
        actions: [
            {label: "ec.setOptions({view: 'timeGridDay', slotDuration: '00:15'})", run: ec => void ec.setOptions({view: 'timeGridDay', slotDuration: '00:15'})},
            {label: "ec.setOptions({view: 'timeGridWeek', slotDuration: undefined})", run: ec => void ec.setOptions({view: 'timeGridWeek', slotDuration: undefined})}
        ]
    },
    addEvent: {
        base: week,
        actions: [{
            label: "ec.addEvent({start: today, end: today, allDay: true, title: 'New event', color: '#14b8a6'})",
            run: (ec, {today}) => ec.addEvent({start: today, end: today, allDay: true, title: 'New event', color: '#14b8a6'})
        }]
    },
    getEventById: {
        base: week,
        actions: [
            {label: 'ec.getEventById(1)', run: ec => ec.getEventById(1)},
            {label: 'ec.getEventById(100)', run: ec => ec.getEventById(100)}
        ]
    },
    getEvents: {base: week, actions: [{label: 'ec.getEvents()', run: ec => ec.getEvents()}]},
    removeEventById: {
        base: week,
        actions: [
            {label: 'ec.removeEventById(1)', run: ec => void ec.removeEventById(1)},
            {label: 'ec.removeEventById(3)', run: ec => void ec.removeEventById(3)}
        ]
    },
    updateEvent: {
        base: week,
        actions: [{
            label: "ec.updateEvent({...ec.getEventById(1), title: 'Renamed', backgroundColor: '#e11d48'})",
            run: ec => ec.updateEvent({...ec.getEventById(1), title: 'Renamed', backgroundColor: '#e11d48'})
        }]
    },
    refetchEvents: {
        base: ({events, log}) => ({
            view: 'timeGridWeek', scrollTime: '08:00',
            eventSources: [{events: () => {
                log('the events are requested');
                return new Promise(resolve => setTimeout(() => resolve(events), 500));
            }}]
        }),
        actions: [{label: 'ec.refetchEvents()', run: ec => void ec.refetchEvents()}]
    },
    refetchResources: {
        base: ({events, resources, log}) => ({
            view: 'resourceTimeGridDay', scrollTime: '08:00', events,
            resources: () => {
                log('the resources are requested');
                return resources;
            }
        }),
        actions: [{label: 'ec.refetchResources()', run: ec => void ec.refetchResources()}]
    },
    dateFromPoint: {
        base: week,
        actions: [{
            label: 'ec.dateFromPoint(x, y).date for the center of the calendar',
            run: (ec, context, el) => {
                let {left, top, width, height} = el.querySelector('.ec-main').getBoundingClientRect();
                return ec.dateFromPoint(left + width / 2, top + height / 2)?.date;
            }
        }]
    },
    getView: {
        base: week,
        actions: [
            {label: 'ec.getView().type', run: ec => ec.getView().type},
            {label: 'ec.getView().title', run: ec => ec.getView().title},
            {label: 'ec.getView().currentStart', run: ec => ec.getView().currentStart}
        ]
    },
    gotoDate: {
        base: week,
        actions: [
            {label: 'ec.gotoDate(addDays(today, 30))', run: (ec, {today, addDays}) => void ec.gotoDate(addDays(today, 30))},
            {label: 'ec.gotoDate()', run: ec => void ec.gotoDate()}
        ]
    },
    next: {base: week, actions: [{label: 'ec.next()', run: ec => void ec.next()}]},
    prev: {base: week, actions: [{label: 'ec.prev()', run: ec => void ec.prev()}]},
    unselect: {
        base: context => ({...week(context), selectable: true, unselectAuto: false}),
        actions: [{label: 'ec.unselect()', run: ec => void ec.unselect()}],
        note: 'Select a range first: drag over the empty slots.'
    },
};
