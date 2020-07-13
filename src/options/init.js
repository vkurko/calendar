export function createInitOptions(plugins) {
    let options = {
        date: new Date(),
        duration: {weeks: 1},
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
        dateClick: undefined,
        slotDuration: {hours: 1},
        slotLabelFormat: {
            hour: 'numeric',
            minute: '2-digit'
        },
        scrollTime: '06:00:00',
        dayHeaderFormat: {
            weekday: 'short',
            month: 'numeric',
            day: 'numeric'
        },
        firstDay: 0,
        highlightDate: false,
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
            sidebar: 'ec-sidebar ec-no-grow',
            content: 'ec-content ec-grow',
            lines: 'ec-lines',
            line: 'ec-line',
            column: 'ec-column ec-grow',
            today: 'ec-today',
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
            title: 'ec-title',
            flex: 'ec-flex'
        }
    };

    for (let plugin of plugins) {
        plugin.createInitOptions(options);
    }

    return options;
}
