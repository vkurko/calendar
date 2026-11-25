- Type `array`
- Default `[]`

The events of the calendar: an array of plain objects that are [parsed](../../event-object/#parsing-event-from-a-plain-object) into [Event](../../event-object/) objects.

```js
let options = {
    events: [
        {id: 1, title: 'Meeting', start: '2026-12-01 10:00', end: '2026-12-01 11:30'},
        {id: 2, title: 'Conference', start: '2026-12-02', end: '2026-12-04', allDay: true}
    ]
};
```
To load the events from a server, use [eventSources](../eventsources/) instead. If `eventSources` is given, this option is not used.
