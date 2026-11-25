- Type `array`
- Default `[]`

The dates that are highlighted in the calendar: holidays, for example.

Each date is an ISO8601 date string or a JavaScript Date object:

```js
let options = {
    highlightedDates: ['2026-12-25', '2026-12-26', new Date(2027, 0, 1)]
};
```
