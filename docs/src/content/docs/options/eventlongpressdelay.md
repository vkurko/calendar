---
title: "eventLongPressDelay"
description: "On touch devices, how many milliseconds the user has to hold a finger on an event before it can be dragged or resized. A shorter touch scrolls the calendar."
---

- Type `integer`
- Default `undefined`
- Requires `Interaction` plugin

On touch devices, how many milliseconds the user has to hold a finger on an event before it can be dragged or resized. A shorter touch scrolls the calendar.

```js
let options = {
    eventLongPressDelay: 500
};
```
Without a value, [longPressDelay](../longpressdelay/) is used.
