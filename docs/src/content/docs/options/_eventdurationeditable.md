- Type `boolean`
- Default `true`
- Requires `Interaction` plugin

Lets the user resize the events. Set it to `false` to forbid resizing:

```js
let options = {
    eventDurationEditable: false
};
```
An event can override it with its own `durationEditable` property. With `null`, the [editable](../editable/) option decides.
