- Type `string`, `integer` or `object`
- Default `undefined`

How often the time slots are labeled in the `timeGrid`, `resourceTimeGrid` and `resourceTimeline` views.

The value is anything that can be [parsed into a Duration](../../duration-object/#parsing-duration-from-input-values) object.

```js
let options = {
    slotDuration: '00:15',
    // A label for each hour
    slotLabelInterval: '01:00'
};
```
Without a value, every slot is labeled, or every other slot if [slotDuration](../slotduration/) is less than an hour.
