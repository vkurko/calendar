- Type `string`, `integer` or `object`
- Default `'00:30:00'`
> Views override the default value as follows:
> - resourceTimelineMonth `{days: 1}`
> - resourceTimelineYear `{days: 1}`

The length of one time slot, which is the step of the time grid.

The value is anything that can be [parsed into a Duration](../../duration-object/#parsing-duration-from-input-values) object.

```js
let options = {
    // A slot of 15 minutes
    slotDuration: '00:15'
};
```
How often the slots are labeled is set with [slotLabelInterval](../slotlabelinterval/), and the step of dragging, resizing and selecting with [snapDuration](../snapduration/).
