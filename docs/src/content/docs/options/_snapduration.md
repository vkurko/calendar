- Type `string`, `integer` or `object`
- Default `undefined`

The step of time by which an event is [dragged](../editable/) and [resized](../editable/), and a range is [selected](../selectable/). By default it is equal to [slotDuration](../slotduration/).

The value is anything that can be [parsed into a Duration](../../duration-object/#parsing-duration-from-input-values) object.

```js
let options = {
    slotDuration: '00:30',
    // The events are moved by 5 minutes
    snapDuration: '00:05'
};
```
