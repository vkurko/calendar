- Type `function`
- Default `undefined`
- Requires `Interaction` plugin

Limits what can be selected.

The function is called on every move of the pointer during the selection. It receives the same argument as [select](../select/), with the range as it would be selected, and returns `false` to forbid this range.

```js
let options = {
    selectable: true,
    // A selection cannot start on the weekend
    selectConstraint: ({start}) => ![0, 6].includes(start.getDay())
};
```
While the range is not allowed, the selection keeps the last allowed range and the cursor changes to `not-allowed`. Releasing the pointer there cancels the selection.
