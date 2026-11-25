- Parameters
  - `date` `Date`, `string` or `undefined` This value can be either a JavaScript Date object, or an ISO8601 date string like `'2026-12-31'`. `undefined` means today in the calendar's [timeZone](../../options/timezone/)
- Return value `EventCalendar` The calendar instance for chaining

Moves the current calendar date to the given date and, in views with horizontal scrolling (`resourceTimeline` views and `resourceTimeGrid` views with [datesAboveResources](../../options/datesaboveresources/) enabled), additionally scrolls the view to make this date visible.

Unlike `setOption('date', date)`, which scrolls the view to today whenever today is inside the new visible period, this method always scrolls to the given date.

```js
// E.g. Scroll to the date of the found event
ec.gotoDate(event.start);
```
