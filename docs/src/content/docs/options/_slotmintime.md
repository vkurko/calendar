- Type `string`, `integer` or `object`
- Default `'00:00:00'`

The time of the day at which the time slots start.

The value is anything that can be [parsed into a Duration](../../duration-object/#parsing-duration-from-input-values) object.

```js
let options = {
    slotMinTime: '08:00',
    slotMaxTime: '18:00'
};
```
