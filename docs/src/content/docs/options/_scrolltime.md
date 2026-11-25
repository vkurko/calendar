- Type `string`, `integer` or `object`
- Default `'06:00:00'`

The time the calendar is scrolled to when it is shown and each time it moves to other dates, so that the working hours are visible without scrolling.

The value is anything that can be [parsed into a Duration](../../duration-object/#parsing-duration-from-input-values) object.

```js
let options = {
    scrollTime: '08:00'
};
```
