- Type `Date`, `string` or `undefined`
- Default `undefined`

The date the calendar shows. The view displays the period that contains this date: its week, its month and so on.

The value is a JavaScript Date object or an ISO8601 date string. Without a value it is today in the calendar's [timeZone](../timezone/).

```js
let options = {
    date: '2026-12-31'
};
```
The option follows the navigation, so [getOption](../../methods/getoption/)`('date')` returns the date that is shown at the moment.
