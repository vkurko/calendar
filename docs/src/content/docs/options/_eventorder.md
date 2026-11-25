- Type `function`
- Default `undefined`

The order of the events that are shown at the same place: which one is higher in a day of the month view, or to the left in a time slot.

The value is a function that compares two [Event](../../event-object/) objects, like the function of `Array.sort()`: it returns a negative number if the first event comes before the second, a positive one if it comes after, and zero if they are equal.

```js
let options = {
    // By title
    eventOrder: (a, b) => a.title.localeCompare(b.title)
};
```
By default the events are ordered by their start time, and of the events that start at the same time the all-day ones come first.
