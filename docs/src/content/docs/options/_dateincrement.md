- Type `string`, `integer` or `object`
- Default `undefined`

How far the calendar moves when the prev and next buttons are clicked, or the [prev()](../../methods/prev/) and [next()](../../methods/next/) methods are called. By default it moves by the whole view, that is by its [duration](../duration/).

The value is anything that can be [parsed into a Duration](../../duration-object/#parsing-duration-from-input-values) object.

```js
let options = {
    view: 'timeGridWeek',
    // Show a week, but move two weeks at a time
    dateIncrement: {weeks: 2}
};
```
