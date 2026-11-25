# EventCalendar for React

The React component of [EventCalendar](https://github.com/vkurko/calendar), a full-sized drag & drop JavaScript event calendar with resource & timeline views.

See the [demo](https://vkurko.github.io/calendar/) and the [documentation](https://github.com/vkurko/calendar#readme) of all options and methods.

## Usage
The first step is to install the EventCalendar `react` package:
```bash
npm install --save-dev @event-calendar/react
```
This package provides the `EventCalendar` component, as well as plugins for various views. You must use at least one plugin that provides a view. The following plugins are currently available:

* `DayGrid`
* `List`
* `ResourceTimeline`
* `ResourceTimeGrid`
* `TimeGrid`
* `Interaction` (doesn't provide a view)

Then in your React component, use the calendar like this:
```jsx
import {useState} from 'react';
import {EventCalendar, TimeGrid} from '@event-calendar/react';
import '@event-calendar/react/index.css';

const plugins = [TimeGrid];

export default function App() {
    const [events, setEvents] = useState([
        // your list of events
    ]);

    return (
        <EventCalendar
            plugins={plugins}
            view="timeGridWeek"
            events={events}
            eventClick={({event}) => console.log(event.id)}
        />
    );
}
```
All [options](https://github.com/vkurko/calendar#options) are passed as props, and the calendar is updated when they change. Objects, arrays and callbacks can be written right in JSX, there is no need for `useMemo` and `useCallback`. The `className`, `style` and `id` props are set on the element that wraps the calendar.

The calendar is destroyed gracefully when the component containing it is destroyed.

### Rendering content with React
The following options accept JSX or a function that returns JSX:

* [allDayContent](https://github.com/vkurko/calendar#alldaycontent)
* [dayCellContent](https://github.com/vkurko/calendar#daycellcontent)
* [eventContent](https://github.com/vkurko/calendar#eventcontent)
* [moreLinkContent](https://github.com/vkurko/calendar#morelinkcontent)
* [noEventsContent](https://github.com/vkurko/calendar#noeventscontent)
* [resourceLabelContent](https://github.com/vkurko/calendar#resourcelabelcontent)
* [weekNumberContent](https://github.com/vkurko/calendar#weeknumbercontent)
* the `content` property of [customButtons](https://github.com/vkurko/calendar#custombuttons)

```jsx
<EventCalendar
    plugins={plugins}
    eventContent={({event, timeText}) => <EventBody event={event} time={timeText}/>}
    noEventsContent={<i>No events</i>}
    headerToolbar={{start: 'title', center: '', end: 'filter today prev,next'}}
    customButtons={{filter: {content: <input value={query} onChange={e => setQuery(e.target.value)}/>}}}
/>
```
The argument of the function is described in the documentation of each option. If the function returns `null` or `undefined`, the default content is shown.

### Calling methods in React
The [methods](https://github.com/vkurko/calendar#methods) of the calendar are available through the `ref`:
```jsx
const calendar = useRef(null);

<EventCalendar ref={calendar} plugins={plugins}/>
<button onClick={() => calendar.current.next()}>Next</button>
```

## License
MIT
