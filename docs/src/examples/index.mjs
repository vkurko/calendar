/**
 * The examples of the documentation. Each one is run live and its code is shown for every framework.
 *
 * `options` is a function, so that the code that is shown is the code that runs. It receives:
 *   events, resources — the sample data, people — the same resources as people with a role and a photo,
 *   meetings          — a day of these people: events with a type, a room and attendees instead of colors,
 *   today, addDays, time, week — to build dates relative to today: `time(date, '12:30')` is the date at
 *                       that time, `week` are the seven days of the current week from Sunday,
 *   ec                — the calendar instance (in the shown code it becomes what the framework uses),
 *   log               — writes to the panel under the calendar (console.log in the shown code).
 *
 * `content` renders the content of an option: {{x}} in `body` is a value of the argument listed in `args`.
 * Richer content gives the markup itself: `render` returns the HTML (it runs in the demo and is shown for
 * plain JavaScript), and `code` has the same markup written for each framework.
 * `css` are the styles of the example, which are shown and applied.
 */
export const groups = ['Views', 'Interaction', 'Appearance', 'Data'];

export const examples = [
    // --- Views ---
    {
        slug: 'month-view', title: 'Month view', group: 'Views', plugins: ['DayGrid'],
        description: 'A classic month grid. With `dayMaxEvents` the rows keep the same height and the events that do not fit are collected under the “+more” link.',
        options: ({events}) => ({
            view: 'dayGridMonth',
            // The limit is the height of the day cells, so the calendar needs a height
            height: '720px',
            dayMaxEvents: true,
            events
        })
    },
    {
        slug: 'week-view', title: 'Week view', group: 'Views', plugins: ['TimeGrid'],
        description: 'A week with a time axis, all-day row and the indicator of the current time.',
        options: ({events}) => ({
            view: 'timeGridWeek',
            nowIndicator: true,
            scrollTime: '08:00',
            events
        })
    },
    {
        slug: 'day-view', title: 'Day view', group: 'Views', plugins: ['TimeGrid'],
        description: 'One day with 15-minute slots.',
        options: ({events}) => ({
            view: 'timeGridDay',
            slotDuration: '00:15',
            slotLabelInterval: '01:00',
            scrollTime: '08:00',
            events
        })
    },
    {
        slug: 'list-view', title: 'List view', group: 'Views', plugins: ['List'],
        description: 'The events of the week as an agenda, grouped by day.',
        options: ({events}) => ({
            view: 'listWeek',
            events
        })
    },
    {
        slug: 'resource-columns', title: 'Resources as columns', group: 'Views', plugins: ['ResourceTimeGrid'],
        description: 'Each resource — a room, a person, a machine — gets its own column of the day.',
        options: ({events, resources}) => ({
            view: 'resourceTimeGridDay',
            scrollTime: '08:00',
            resources,
            events
        })
    },
    {
        slug: 'resource-week', title: 'Resources by day', group: 'Views', plugins: ['ResourceTimeGrid'],
        description: 'A week of resource columns. `datesAboveResources` puts the days on top and the resources inside each day, and `columnWidth` keeps the columns readable.',
        options: ({events, resources}) => ({
            view: 'resourceTimeGridWeek',
            datesAboveResources: true,
            // The columns keep a width they can be read at, and the calendar is scrolled horizontally
            columnWidth: '110px',
            scrollTime: '08:00',
            resources,
            events
        })
    },
    {
        slug: 'timeline', title: 'Resource timeline', group: 'Views', plugins: ['ResourceTimeline'],
        description: 'Resources as rows and time running horizontally. Overlapping events are stacked and the rows grow to fit them.',
        options: ({events, resources}) => ({
            view: 'resourceTimelineWeek',
            slotMinTime: '08:00',
            slotMaxTime: '20:00',
            slotDuration: '01:00',
            slotWidth: 72,
            resources,
            events
        })
    },
    {
        slug: 'timeline-month', title: 'Month timeline', group: 'Views', plugins: ['ResourceTimeline'],
        description: 'A month on the timeline, one column per day — a planning board.',
        options: ({events, resources}) => ({
            view: 'resourceTimelineMonth',
            resources,
            events
        })
    },
    {
        slug: 'nested-resources', title: 'Nested resources', group: 'Views', plugins: ['ResourceTimeline'],
        description: 'Resources can have children, the groups are collapsed and expanded with a click.',
        options: ({events}) => ({
            view: 'resourceTimelineWeek',
            slotMinTime: '08:00',
            slotMaxTime: '20:00',
            slotDuration: '01:00',
            slotWidth: 72,
            resources: [
                {id: 10, title: 'First floor', children: [
                    {id: 1, title: 'Room A'},
                    {id: 2, title: 'Room B'}
                ]},
                {id: 20, title: 'Second floor', children: [
                    {id: 3, title: 'Room C'}
                ]}
            ],
            events
        })
    },
    {
        slug: 'custom-view', title: 'Custom view', group: 'Views', plugins: ['TimeGrid'],
        description: 'A view of your own is a standard view with other options: here, four days instead of a week.',
        options: ({events}) => ({
            view: 'timeGridFourDay',
            views: {
                timeGridFourDay: {
                    type: 'timeGridWeek',
                    duration: {days: 4}
                }
            },
            // The text of the button of the new view
            buttonText: text => ({...text, today: 'Today', timeGridFourDay: '4 days', timeGridWeek: 'Week'}),
            headerToolbar: {start: 'title', center: '', end: 'timeGridFourDay,timeGridWeek today prev,next'},
            scrollTime: '08:00',
            events
        })
    },
    {
        slug: 'view-switcher', title: 'Switching views', group: 'Views',
        plugins: ['DayGrid', 'TimeGrid', 'List'],
        description: 'The names of the views in the toolbar become the buttons that switch between them.',
        options: ({events}) => ({
            view: 'timeGridWeek',
            headerToolbar: {
                start: 'title',
                center: '',
                end: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek today prev,next'
            },
            // The texts of the buttons
            buttonText: text => ({
                ...text, today: 'Today', dayGridMonth: 'Month', timeGridWeek: 'Week', timeGridDay: 'Day', listWeek: 'List'
            }),
            scrollTime: '08:00',
            events
        })
    },

    // --- Interaction ---
    {
        slug: 'drag-resize-select', title: 'Drag, resize and select', group: 'Interaction',
        plugins: ['TimeGrid', 'Interaction'],
        description: 'Everything at once: drag an event to another time, pull its edge to resize it, and drag over the empty slots to create a new one.',
        options: ({events, ec, log}) => ({
            view: 'timeGridWeek',
            editable: true,
            selectable: true,
            scrollTime: '08:00',
            events,
            eventDrop: ({event}) => log('eventDrop', event.title, '→', event.start),
            eventResize: ({event}) => log('eventResize', event.title, event.start, '–', event.end),
            select: ({start, end, allDay}) => {
                log('select', start, '–', end);
                ec.addEvent({start, end, allDay, title: 'New event', color: '#14b8a6'});
                ec.unselect();
            }
        })
    },
    {
        slug: 'drag-and-drop', title: 'Drag & drop', group: 'Interaction', plugins: ['TimeGrid', 'Interaction'],
        description: 'The events can be dragged to another time or day, and `eventDrop` tells where an event has landed.',
        options: ({events, log}) => ({
            view: 'timeGridWeek',
            editable: true,
            scrollTime: '08:00',
            events,
            eventDrop: ({event, oldEvent}) => {
                log('eventDrop', event.title, oldEvent.start, '→', event.start);
            }
        })
    },
    {
        slug: 'resize', title: 'Resizing', group: 'Interaction', plugins: ['TimeGrid', 'Interaction'],
        description: 'Drag the bottom edge of an event to change its duration — or the top edge, with `eventResizableFromStart`.',
        options: ({events, log}) => ({
            view: 'timeGridWeek',
            editable: true,
            eventStartEditable: false,
            eventResizableFromStart: true,
            scrollTime: '08:00',
            events,
            eventResize: ({event}) => {
                log('eventResize', event.title, event.start, '–', event.end);
            }
        })
    },
    {
        slug: 'select-to-create', title: 'Select to create', group: 'Interaction', plugins: ['TimeGrid', 'Interaction'],
        description: 'Drag over the empty slots to select a time range, and create an event from it.',
        options: ({events, ec}) => ({
            view: 'timeGridWeek',
            selectable: true,
            scrollTime: '08:00',
            events,
            select: ({start, end, allDay}) => {
                ec.addEvent({start, end, allDay, title: 'New event', color: '#14b8a6'});
                ec.unselect();
            }
        })
    },
    {
        slug: 'click-events', title: 'Clicks', group: 'Interaction', plugins: ['DayGrid', 'Interaction'],
        description: 'Click a day to add an event, click an event to remove it.',
        options: ({events, ec, log}) => ({
            view: 'dayGridMonth',
            events,
            dateClick: ({date}) => {
                log('dateClick', date);
                ec.addEvent({start: date, end: date, allDay: true, title: 'Added by click', color: '#14b8a6'});
            },
            eventClick: ({event}) => {
                log('eventClick', event.title);
                ec.removeEventById(event.id);
            }
        })
    },
    {
        slug: 'drag-constraints', title: 'Drag constraints', group: 'Interaction', plugins: ['TimeGrid', 'Interaction'],
        description: 'The events cannot be dropped or resized into the weekend, and a selection cannot start there.',
        options: ({events}) => ({
            view: 'timeGridWeek',
            editable: true,
            selectable: true,
            scrollTime: '08:00',
            events,
            dragConstraint: ({event}) => ![0, 6].includes(event.start.getDay()),
            resizeConstraint: ({event}) => ![0, 6].includes(event.end.getDay()),
            selectConstraint: ({start}) => ![0, 6].includes(start.getDay())
        })
    },
    {
        slug: 'drag-between-resources', title: 'Drag between resources', group: 'Interaction',
        plugins: ['ResourceTimeline', 'Interaction'],
        description: 'On the timeline an event can be moved to another resource as well as to another time.',
        options: ({events, resources, log}) => ({
            view: 'resourceTimelineWeek',
            editable: true,
            slotMinTime: '08:00',
            slotMaxTime: '20:00',
            slotDuration: '01:00',
            slotWidth: 72,
            resources,
            events,
            eventDrop: ({event, newResource}) => {
                log('eventDrop', event.title, newResource ? '→ ' + newResource.title : '');
            }
        })
    },
    {
        slug: 'pointer', title: 'Pointer', group: 'Interaction', plugins: ['TimeGrid', 'Interaction'],
        description: 'With `pointer` the slot under the cursor is highlighted, which helps to aim before a click.',
        options: ({events, log}) => ({
            view: 'timeGridWeek',
            pointer: true,
            scrollTime: '08:00',
            events,
            dateClick: ({date}) => log('dateClick', date)
        })
    },
    {
        slug: 'hover', title: 'Hover', group: 'Interaction', plugins: ['DayGrid'],
        description: '`eventMouseEnter` and `eventMouseLeave` are the place to show a tooltip or a preview.',
        options: ({events, log}) => ({
            view: 'dayGridMonth',
            events,
            eventMouseEnter: ({event}) => log('eventMouseEnter', event.title),
            eventMouseLeave: ({event}) => log('eventMouseLeave', event.title)
        })
    },
    {
        slug: 'toolbar-buttons', title: 'Your buttons in the toolbar', group: 'Interaction', plugins: ['TimeGrid'],
        description: 'Custom buttons call the methods of the calendar: here they add an event and jump a month ahead.',
        options: ({events, ec, today, addDays}) => ({
            view: 'timeGridWeek',
            scrollTime: '08:00',
            headerToolbar: {start: 'title', center: '', end: 'addEvent nextMonth today prev,next'},
            customButtons: {
                addEvent: {
                    text: '+ Event',
                    click: () => ec.addEvent({start: today, end: today, allDay: true, title: 'Added by the button'})
                },
                nextMonth: {
                    text: 'In a month',
                    click: () => ec.gotoDate(addDays(ec.getOption('date'), 30))
                }
            },
            events
        })
    },

    // --- Appearance ---
    {
        slug: 'custom-event-content', title: 'Your own events and resources', group: 'Appearance',
        plugins: ['ResourceTimeGrid'],
        description: 'A day of a team where everything is rendered in its own way: the events are cards with a type, a room and the photos of the people who take part, and the columns are headed by the members of the team.',
        options: ({meetings, people}) => ({
            view: 'resourceTimeGridDay',
            height: 'auto',
            slotMinTime: '08:00',
            slotMaxTime: '16:00',
            slotHeight: 40,
            allDaySlot: false,
            nowIndicator: true,
            buttonText: text => ({...text, today: 'Today'}),
            // The cards have their own colors
            eventBackgroundColor: 'transparent',
            // Each resource has a role and a photo in its extendedProps
            resources: people,
            // Each event has a type, a room and the attendees in its extendedProps
            events: meetings
        }),
        content: {
            eventContent: {
                args: ['event', 'timeText'],
                render: ({event, timeText}) => `
                    <div class="card ${event.extendedProps.type}">
                        <div class="card-title">${event.title}</div>
                        <div class="card-meta">${timeText} · ${event.extendedProps.room}</div>
                        <div class="card-footer">
                            ${event.extendedProps.attendees.map(person => `<img src="${person.photo}" alt="${person.name}" title="${person.name}">`).join('')}
                            <span class="card-tag">${event.extendedProps.type}</span>
                        </div>
                    </div>`,
                code: {
                    svelte: `<div class={['card', event.extendedProps.type]}>
    <div class="card-title">{event.title}</div>
    <div class="card-meta">{timeText} · {event.extendedProps.room}</div>
    <div class="card-footer">
        {#each event.extendedProps.attendees as person}
            <img src={person.photo} alt={person.name} title={person.name}>
        {/each}
        <span class="card-tag">{event.extendedProps.type}</span>
    </div>
</div>`,
                    react: `<div className={'card ' + event.extendedProps.type}>
    <div className="card-title">{event.title}</div>
    <div className="card-meta">{timeText} · {event.extendedProps.room}</div>
    <div className="card-footer">
        {event.extendedProps.attendees.map(person => (
            <img key={person.name} src={person.photo} alt={person.name} title={person.name}/>
        ))}
        <span className="card-tag">{event.extendedProps.type}</span>
    </div>
</div>`,
                    vue: `<div :class="['card', event.extendedProps.type]">
    <div class="card-title">{{ event.title }}</div>
    <div class="card-meta">{{ timeText }} · {{ event.extendedProps.room }}</div>
    <div class="card-footer">
        <img
            v-for="person in event.extendedProps.attendees"
            :key="person.name" :src="person.photo" :alt="person.name" :title="person.name"
        >
        <span class="card-tag">{{ event.extendedProps.type }}</span>
    </div>
</div>`,
                    angular: `<div class="card" [class]="event.extendedProps.type">
    <div class="card-title">{{ event.title }}</div>
    <div class="card-meta">{{ timeText }} · {{ event.extendedProps.room }}</div>
    <div class="card-footer">
        @for (person of event.extendedProps.attendees; track person.name) {
            <img [src]="person.photo" [alt]="person.name" [title]="person.name">
        }
        <span class="card-tag">{{ event.extendedProps.type }}</span>
    </div>
</div>`
                }
            },
            resourceLabelContent: {
                args: ['resource'],
                render: ({resource}) => `
                    <div class="member">
                        <img src="${resource.extendedProps.photo}" alt="">
                        <b>${resource.title}</b>
                        <small>${resource.extendedProps.role}</small>
                    </div>`,
                code: {
                    svelte: `<div class="member">
    <img src={resource.extendedProps.photo} alt="">
    <b>{resource.title}</b>
    <small>{resource.extendedProps.role}</small>
</div>`,
                    react: `<div className="member">
    <img src={resource.extendedProps.photo} alt=""/>
    <b>{resource.title}</b>
    <small>{resource.extendedProps.role}</small>
</div>`,
                    vue: `<div class="member">
    <img :src="resource.extendedProps.photo" alt="">
    <b>{{ resource.title }}</b>
    <small>{{ resource.extendedProps.role }}</small>
</div>`,
                    angular: `<div class="member">
    <img [src]="resource.extendedProps.photo" alt="">
    <b>{{ resource.title }}</b>
    <small>{{ resource.extendedProps.role }}</small>
</div>`
                }
            }
        },
        css: `/* The event is only a place for the card */
.ec-event {
    padding: 0 2px 2px 0;
    box-shadow: none;
}
/* The whole view is today, so it is not highlighted */
.ec-today {
    background-color: transparent;
}
.card {
    flex: 1;
    min-height: 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 6px 10px;
    border-left: 4px solid var(--accent);
    border-radius: 8px;
    background: color-mix(in srgb, var(--accent) 14%, #fff);
    color: #0f172a;
}
.card.meeting {
    --accent: #6366f1;
}
.card.focus {
    --accent: #10b981;
}
.card.review {
    --accent: #f59e0b;
}
.card.personal {
    --accent: #ec4899;
}
.card-title,
.card-meta {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.card-title {
    font-size: 14px;
    font-weight: 600;
}
.card-meta {
    color: #475569;
    font-size: 12px;
}
.card-footer {
    display: flex;
    align-items: center;
    margin-top: auto;
}
.card-footer img {
    width: 22px;
    height: 22px;
    margin-right: -6px;
    border: 2px solid #fff;
    border-radius: 50%;
}
.card-tag {
    margin-left: auto;
    padding: 1px 8px;
    border-radius: 99px;
    background: var(--accent);
    color: #fff;
    font-size: 11px;
    text-transform: capitalize;
}
.member {
    display: grid;
    justify-items: center;
    gap: 2px;
    padding: 10px 0;
    line-height: 1.3;
}
.member img {
    width: 48px;
    height: 48px;
    margin-bottom: 4px;
    border-radius: 50%;
    box-shadow: 0 0 0 2px #fff, 0 0 0 4px #c7d2fe;
}
.member small {
    color: #64748b;
    font-weight: normal;
}`
    },
    {
        slug: 'day-cell-content', title: 'Your own day cells', group: 'Appearance', plugins: ['DayGrid'],
        description: 'The day cell with the name of the weekday next to the number, and today as a filled circle.',
        options: ({events}) => ({
            view: 'dayGridMonth',
            events
        }),
        content: {dayCellContent: {
            args: ['date', 'isToday'],
            render: ({date, isToday}) => `
                <span class="weekday">${date.toLocaleDateString('en', {weekday: 'short'})}</span>
                <span class="${isToday ? 'number today' : 'number'}">${date.getDate()}</span>`,
            code: {
                svelte: `<span class="weekday">{date.toLocaleDateString('en', {weekday: 'short'})}</span>
<span class={['number', isToday && 'today']}>{date.getDate()}</span>`,
                react: `<span className="weekday">{date.toLocaleDateString('en', {weekday: 'short'})}</span>
<span className={isToday ? 'number today' : 'number'}>{date.getDate()}</span>`,
                vue: `<span class="weekday">{{ date.toLocaleDateString('en', {weekday: 'short'}) }}</span>
<span :class="['number', {today: isToday}]">{{ date.getDate() }}</span>`,
                angular: `<span class="weekday">{{ date.toLocaleDateString('en', {weekday: 'short'}) }}</span>
<span class="number" [class.today]="isToday">{{ date.getDate() }}</span>`
            }
        }},
        css: `.weekday {
    margin-right: 4px;
    color: #94a3b8;
    font-size: 0.75em;
    text-transform: uppercase;
}
.number {
    display: inline-grid;
    place-items: center;
    min-width: 1.75em;
    height: 1.75em;
    border-radius: 50%;
    font-weight: 600;
}
.number.today {
    background: #4f46e5;
    color: #fff;
}`
    },
    {
        slug: 'resource-labels', title: 'Your own resource labels', group: 'Appearance', plugins: ['ResourceTimeline'],
        description: 'People as resources: a photo, a name and a role in the label. The data comes from the extendedProps of each resource.',
        options: ({events, people}) => ({
            view: 'resourceTimelineWeek',
            slotMinTime: '08:00',
            slotMaxTime: '20:00',
            slotDuration: '01:00',
            slotWidth: 72,
            // Each resource has a role and a photo in its extendedProps
            resources: people,
            events
        }),
        content: {resourceLabelContent: {
            args: ['resource'],
            render: ({resource}) => `
                <span class="person">
                    <img src="${resource.extendedProps.photo}" alt="">
                    <span>
                        <b>${resource.title}</b>
                        <small>${resource.extendedProps.role}</small>
                    </span>
                </span>`,
            code: {
                svelte: `<span class="person">
    <img src={resource.extendedProps.photo} alt="">
    <span>
        <b>{resource.title}</b>
        <small>{resource.extendedProps.role}</small>
    </span>
</span>`,
                react: `<span className="person">
    <img src={resource.extendedProps.photo} alt=""/>
    <span>
        <b>{resource.title}</b>
        <small>{resource.extendedProps.role}</small>
    </span>
</span>`,
                vue: `<span class="person">
    <img :src="resource.extendedProps.photo" alt="">
    <span>
        <b>{{ resource.title }}</b>
        <small>{{ resource.extendedProps.role }}</small>
    </span>
</span>`,
                angular: `<span class="person">
    <img [src]="resource.extendedProps.photo" alt="">
    <span>
        <b>{{ resource.title }}</b>
        <small>{{ resource.extendedProps.role }}</small>
    </span>
</span>`
            }
        }},
        css: `.person {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 0;
    text-align: left;
}
.person img {
    width: 36px;
    height: 36px;
    border-radius: 50%;
}
.person b,
.person small {
    display: block;
    white-space: nowrap;
}
.person small {
    color: #64748b;
}`
    },
    {
        slug: 'event-colors', title: 'Event colors', group: 'Appearance', plugins: ['TimeGrid'],
        description: 'A color can be set for all events at once and for each event separately.',
        options: ({events}) => ({
            view: 'timeGridWeek',
            scrollTime: '08:00',
            eventBackgroundColor: '#1e293b',
            eventTextColor: '#f8fafc',
            // Only the first events keep their own color
            events: events.map(event => event.id > 4 ? {...event, color: undefined} : event)
        })
    },
    {
        slug: 'background-events', title: 'Background events', group: 'Appearance', plugins: ['TimeGrid'],
        description: 'Events with `display: \'background\'` color the time itself: a lunch break, focus time, the hours that are taken. Regular events are shown over them.',
        options: ({events, week, time}) => ({
            view: 'timeGridWeek',
            scrollTime: '08:00',
            events: [
                // A lunch break on each working day
                ...[1, 2, 3, 4, 5].map(weekday => ({
                    start: time(week[weekday], '12:00'), end: time(week[weekday], '13:00'),
                    display: 'background', backgroundColor: '#94a3b8'
                })),
                // Focus time, booked hours, maintenance and so on, each in its own color
                {start: time(week[1], '08:00'), end: time(week[1], '11:00'), display: 'background', backgroundColor: '#22c55e'},
                {start: time(week[2], '13:30'), end: time(week[2], '16:00'), display: 'background', backgroundColor: '#ef4444'},
                {start: time(week[3], '08:00'), end: time(week[3], '10:30'), display: 'background', backgroundColor: '#eab308'},
                {start: time(week[4], '13:30'), end: time(week[4], '17:00'), display: 'background', backgroundColor: '#8b5cf6'},
                {start: time(week[5], '08:00'), end: time(week[5], '12:00'), display: 'background', backgroundColor: '#06b6d4'},
                // A couple of regular events
                {start: time(week[2], '09:00'), end: time(week[2], '10:30'), title: 'Sprint planning'},
                {start: time(week[4], '09:30'), end: time(week[4], '11:00'), title: 'Code review'}
            ]
        })
    },
    {
        slug: 'highlighted-dates', title: 'Highlighted dates', group: 'Appearance', plugins: ['DayGrid'],
        description: 'Holidays, deadlines and other special days.',
        options: ({events, today, addDays}) => ({
            view: 'dayGridMonth',
            highlightedDates: [addDays(today, 2), addDays(today, 3), addDays(today, 9)],
            events
        })
    },
    {
        slug: 'week-numbers', title: 'Week numbers', group: 'Appearance', plugins: ['DayGrid'],
        description: 'The ISO number of the week at the start of each row.',
        options: ({events}) => ({
            view: 'dayGridMonth',
            weekNumbers: true,
            firstDay: 1,
            events
        })
    },
    {
        slug: 'business-hours', title: 'Working week', group: 'Appearance', plugins: ['TimeGrid'],
        description: 'Only the working days and hours: the weekend is hidden and the day runs from 8 to 18.',
        options: ({events}) => ({
            view: 'timeGridWeek',
            hiddenDays: [0, 6],
            slotMinTime: '08:00',
            slotMaxTime: '18:00',
            slotHeight: 32,
            events
        })
    },
    {
        slug: 'no-overlap', title: 'Events side by side', group: 'Appearance', plugins: ['TimeGrid'],
        description: 'The events that happen at the same time placed side by side, with `slotEventOverlap: false`. By default they overlap a little to save space.',
        options: ({events, today}) => ({
            view: 'timeGridDay',
            slotEventOverlap: false,
            scrollTime: '08:00',
            // All the events of the week on the same day
            events: events.filter(event => !event.allDay).map(event => ({
                ...event,
                start: new Date(today.getFullYear(), today.getMonth(), today.getDate(), event.start.getHours(), event.start.getMinutes()),
                end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), event.end.getHours(), event.end.getMinutes())
            }))
        })
    },
    {
        slug: 'locale', title: 'Language and formats', group: 'Appearance', plugins: ['TimeGrid'],
        description: 'The dates follow the locale, the week starts on Monday, and the texts of the buttons are yours.',
        options: ({events}) => ({
            view: 'timeGridWeek',
            locale: 'de',
            firstDay: 1,
            buttonText: text => ({...text, today: 'Heute'}),
            allDayContent: 'Ganztägig',
            eventTimeFormat: {hour: '2-digit', minute: '2-digit', hour12: false},
            slotLabelFormat: {hour: '2-digit', minute: '2-digit', hour12: false},
            scrollTime: '08:00',
            events
        })
    },
    {
        slug: 'timeline-zoom', title: 'Timeline scale', group: 'Appearance', plugins: ['ResourceTimeline'],
        description: 'The duration and the width of a slot set the scale of the timeline.',
        options: ({events, resources}) => ({
            view: 'resourceTimelineDay',
            slotDuration: '00:15',
            slotLabelInterval: '01:00',
            slotWidth: 28,
            scrollTime: '08:00',
            resources,
            events
        })
    },

    // --- Data ---
    {
        slug: 'event-sources', title: 'Loading events', group: 'Data', plugins: ['TimeGrid'],
        description: 'Events are fetched for the visible period: from a URL or with a function. `loading` reports the start and the end of it.',
        options: ({events, log}) => ({
            view: 'timeGridWeek',
            scrollTime: '08:00',
            eventSources: [{
                // Here could be a request to your server for the period from info.start to info.end
                events: info => new Promise(resolve => setTimeout(() => resolve(events), 700))
            }],
            loading: isLoading => log('loading', isLoading)
        })
    },
    {
        slug: 'event-filter', title: 'Filtering events', group: 'Data', plugins: ['TimeGrid'],
        description: 'Decide which events are shown without touching the data.',
        options: ({events}) => ({
            view: 'timeGridWeek',
            scrollTime: '08:00',
            events,
            eventFilter: ({event}) => !event.allDay && event.start.getHours() < 12
        })
    },
    {
        slug: 'valid-range', title: 'Limiting navigation', group: 'Data', plugins: ['DayGrid'],
        description: 'The calendar cannot be navigated outside of `validRange`, and the days out of it are disabled.',
        options: ({events, today, addDays}) => ({
            view: 'dayGridMonth',
            validRange: {start: addDays(today, -7), end: addDays(today, 21)},
            events
        })
    },
    {
        slug: 'time-zone', title: 'Time zones', group: 'Data', plugins: ['TimeGrid'],
        description: 'The same events shown in the time of New York. Any IANA time zone name works, as well as `UTC` and `local`.',
        options: ({events}) => ({
            view: 'timeGridWeek',
            timeZone: 'America/New_York',
            nowIndicator: true,
            // A moment in time is an ISO string with an offset
            events: events.filter(event => !event.allDay).map(event => ({
                ...event,
                start: event.start.toISOString(),
                end: event.end.toISOString()
            }))
        })
    },
    {
        slug: 'filter-resources', title: 'Only busy resources', group: 'Data', plugins: ['ResourceTimeGrid'],
        description: 'With `filterResourcesWithEvents` the resources that have no events in the view are hidden.',
        options: ({events, resources}) => ({
            view: 'resourceTimeGridDay',
            filterResourcesWithEvents: true,
            scrollTime: '08:00',
            resources: [...resources, {id: 4, title: 'Room D (always free)'}],
            events
        })
    }
];
