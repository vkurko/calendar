export function createOptions(plugins) {
    let options = {
        date: new Date(),
        duration: {weeks: 1},
        monthMode: false,
        events: [],
        eventSources: [],
        eventColor: undefined,
        eventBackgroundColor: undefined,
        eventTimeFormat: {
            hour: 'numeric',
            minute: '2-digit'
        },
        eventContent: undefined,
        eventClick: undefined,
        eventDidMount: undefined,
        dateClick: undefined,
        slotDuration: {hours: 1},
        slotLabelFormat: {
            hour: 'numeric',
            minute: '2-digit'
        },
        slotMinTime: '00:00:00',
        slotMaxTime: '24:00:00',
        flexibleSlotTimeLimits: false,  // ec option
        scrollTime: '06:00:00',
        dayHeaderFormat: {
            weekday: 'short',
            month: 'numeric',
            day: 'numeric'
        },
        firstDay: 0,
        highlightDate: false,  // ec option
        locale: undefined,
        headerToolbar: {
            start: 'title',
            center: '',
            end: 'today prev,next'
        },
        titleFormat: {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        },
        buttonText: {
            today: 'today',
        },
        height: '800px',
        lazyFetching: true,
        loading: undefined,
        viewDidMount: undefined,
        view: undefined,
        views: {},
        theme: {
            calendar: 'ec',
            header: 'ec-header',
            withScroll: 'ec-with-scroll',
            body: 'ec-body',
            compact: 'ec-compact',
            toolbar: 'ec-toolbar',
            sidebar: 'ec-sidebar',
            content: 'ec-content',
            lines: 'ec-lines',
            line: 'ec-line',
            days: 'ec-days',
            day: 'ec-day',
            dayHead: 'ec-day-head',
            today: 'ec-today',
            otherMonth: 'ec-other-month',
            highlight: 'ec-highlight',
            events: 'ec-events',
            event: 'ec-event',
            eventContent: 'ec-event-content',
            eventTime: 'ec-event-time',
            eventTitle: 'ec-event-title',
            bgEvents: 'ec-bg-events',
            bgEvent: 'ec-bg-event',
            hiddenTimes: 'ec-hidden-times',
            time: 'ec-time',
            button: 'ec-button',
            buttonGroup: 'ec-button-group',
            icon: 'ec-icon',
            active: 'ec-active',
            title: 'ec-title'
        }
    };

    for (let plugin of plugins) {
        plugin.createOptions(options);
    }

    return options;
}
