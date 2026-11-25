- Type `function`
- Default `undefined`
- Requires `Interaction` plugin

Limits how an event can be resized.

The function is called on every move of the pointer while an event is resized. It receives the same argument as [eventResize](../eventresize/), with the event as it would be with the new size, and returns `false` to forbid this size.

```js
let options = {
    // Not longer than 3 hours
    resizeConstraint: ({event}) => event.end - event.start <= 3 * 60 * 60 * 1000
};
```
While the size is not allowed, the event keeps the last allowed size and the cursor changes to `not-allowed`. Releasing the pointer there cancels the resizing.
