- Type `boolean`
- Default `true`

Lets the events that happen at the same time overlap each other a little in the `timeGrid` and `resourceTimeGrid` views, which leaves more room for each of them.

```js
let options = {
    slotEventOverlap: false
};
```
With `false`, such events are placed side by side and share the width of the column.
