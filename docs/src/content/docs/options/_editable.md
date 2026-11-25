- Type `boolean`
- Default `false`
- Requires `Interaction` plugin

Lets the user drag and resize the events, where the more specific options do not decide it.

Dragging is controlled by [eventStartEditable](../eventstarteditable/) and resizing by [eventDurationEditable](../eventdurationeditable/). Both are `true` by default, so with the `Interaction` plugin the events can be dragged and resized even while `editable` is `false`. This option is used for the action whose own option is set to `null`:

```js
let options = {
    // Both dragging and resizing are decided by `editable`
    eventStartEditable: null,
    eventDurationEditable: null,
    editable: true
};
```
For each event the first value that is set is taken, in this order: the `startEditable` (or `durationEditable`) property of the event, the `eventStartEditable` (or `eventDurationEditable`) option, the `editable` property of the event, and this option.
