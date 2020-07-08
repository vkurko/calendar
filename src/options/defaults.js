export function createOptions(plugins) {
    let result = {
        date: new Date(),
        events: [],
        eventContent: undefined,
        eventClick: undefined,
        locale: undefined,
        dayHeaderFormat: {
            weekday: 'short',
            month: 'numeric',
            day: 'numeric',
            omitCommas: true
        },
        timeFormat: {
            hour: '2-digit',
            minute: '2-digit'
        },
        view: undefined,
        views: {},
        duration: {weeks: 1},
        theme: {
            calendar: 'calendar',
            header: 'header',
            body: 'body',
            toolbar: 'toolbar',
            sidebar: 'sidebar no-grow',
            content: 'content grow',
            lines: 'lines',
            line: 'line',
            column: 'column grow',
            events: 'events',
            event: 'event',
            eventTitle: 'event-title',
            bgEvents: 'bg-events',
            bgEvent: 'bg-event',
            time: 'time',
            flex: 'flex'
        }
    };

    for (let plugin of plugins) {
        plugin.extendDefaultOptions(result);
    }

    return result;
}
