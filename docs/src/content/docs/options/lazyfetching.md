---
title: "lazyFetching"
description: "Makes the calendar skip loading when the period it moves to is inside the period it has loaded last, which keeps the number of requests low."
---

- Type `boolean`
- Default `true`

Makes the calendar skip loading when the period it moves to is inside the period it has loaded last, which keeps the number of requests low.

For example, the calendar starts in the month view and loads the events of February. When the user switches to the week view and browses the weeks of February, nothing is loaded: the calendar already has these events.

```js
let options = {
    // Load the events again on every change of the period
    lazyFetching: false
};
```
With `false`, the events are loaded each time the shown period changes: on prev and next, for example.

The same applies to the resources when [refetchResourcesOnNavigate](../refetchresourcesonnavigate/) is enabled.
