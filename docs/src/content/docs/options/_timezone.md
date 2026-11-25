- Type `string`
- Default `'local'`

The time zone the calendar uses to display dates and times.

The following values are accepted:
- `'local'` — uses the browser's local time zone
- `'UTC'` — uses UTC (zero offset)
- A UTC offset string in the form `'±HH:MM'`, e.g. `'+05:30'` or `'-06:00'`
- An [IANA time zone name](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones), e.g. `'America/Los_Angeles'` — follows the rules of that zone, including daylight saving time (DST). An unknown name is treated as `'local'`

Event dates that contain an explicit timezone offset in their ISO string (e.g. `'2028-06-01T10:00:00+02:00'` or `'2028-06-01T08:00:00Z'`) will be shifted to the calendar's timezone. Event dates without timezone info (e.g. `'2028-06-01T10:00:00'`) are treated as floating — they display their wall-clock time as-is and will be interpreted in the calendar's timezone from that point forward.

JavaScript Date objects in event dates are read as the wall-clock time of the calendar's timezone, the same way the calendar passes dates to callbacks and returns them from methods like [getEventById()](../../methods/geteventbyid/). So `new Date(2028, 5, 1, 10, 0)` is displayed as 10:00 in any timezone, and a date from a callback can be passed back to [addEvent()](../../methods/addevent/) or [updateEvent()](../../methods/updateevent/) as is. To pass an exact moment in time, use an ISO string with an offset, e.g. `date.toISOString()`.

When the `timeZone` option changes at runtime, all already-loaded events are automatically shifted to the new timezone. If the [date](../date/) option comes from today (`undefined` or the today button, also after the prev/next buttons), it moves by the days between today in the old and in the new timezone. An explicitly set date stays the same day. Events from [eventSources](../eventsources/) are re-fetched automatically.

A day always has 24 hours in the views, also on a DST day, as with `'local'`. The hour the clocks skip stays in the grid and the hour they repeat is shown once, so an event across the change is drawn longer or shorter than it lasts. A date without an offset in the skipped hour is read like `new Date()` reads it (02:30 means 03:30) and moves to 03:30 when `timeZone` changes, in the repeated hour it is read as its first occurrence.

A format option with `timeZoneName` shows the browser's time zone, not the calendar's.

```js
let options = {
    timeZone: '+02:00',
    events: [
        {
            start: '2028-06-01T10:00:00',        // floating — displayed as 10:00
            end:   '2028-06-01T12:00:00',
            title: 'Meeting'
        },
        {
            start: '2028-06-01T10:00:00+00:00',  // UTC — displayed as 12:00 in +02:00
            end:   '2028-06-01T12:00:00+00:00',
            title: 'Call'
        }
    ]
};
```
