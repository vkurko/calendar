- Type `string`, `integer` or `object`
- Default `'24:00:00'`

The time of the day at which the time slots end. It can be later than midnight to show the night as a part of the previous day.

The value is anything that can be [parsed into a Duration](../../duration-object/#parsing-duration-from-input-values) object.

```js
let options = {
    slotMinTime: '08:00',
    slotMaxTime: '18:00'
};
```
