- Type `function`
- Default `undefined`
- Requires `Interaction` plugin

Limits where an event can be dragged.

The function is called on every move of the pointer while an event is dragged. It receives the same argument as [eventDrop](../eventdrop/), with the event as it would be at the new position, and returns `false` to forbid dropping the event there.

```js
let options = {
    // No events on the weekend
    dragConstraint: ({event}) => ![0, 6].includes(event.start.getDay())
};
```
While the position is not allowed, the event stays at the last allowed position and the cursor changes to `not-allowed`. Releasing the pointer there cancels the dragging.
