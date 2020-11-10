# EventCalendar

See [demo](https://vkurko.github.io/calendar/).

Full-sized JavaScript event calendar with resource view.

Inspired by [FullCalendar](https://fullcalendar.io/) and implements the same options.

#### Usage

Include the following lines of code in the `<head>` section of your page:
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@event-calendar/build/event-calendar.min.css">
<script src="https://cdn.jsdelivr.net/npm/@event-calendar/build/event-calendar.min.js"></script>
```
Then initialize the calendar with something like this:
```javascript
let ec = new EventCalendar(document.getElementById('ec'), {
    view: 'timeGridWeek',
    events: [
        // your list of events
    ]
});
```
#### Available Options

See the [code](https://github.com/vkurko/calendar/blob/master/packages/core/src/storage/options.js) for available options and FullCalendar [docs](https://fullcalendar.io/docs) for options description.