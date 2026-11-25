- Type `boolean`
- Default `true`
- Requires `Interaction` plugin

Lets the user drag the events. Set it to `false` to forbid dragging:

```js
let options = {
    eventStartEditable: false
};
```
An event can override it with its own `startEditable` property. With `null`, the [editable](../editable/) option decides.
