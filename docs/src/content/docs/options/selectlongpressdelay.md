---
title: "selectLongPressDelay"
description: "On touch devices, how many milliseconds the user has to hold a finger before the selection starts. A shorter touch scrolls the calendar."
---

- Type `integer`
- Default `undefined`
- Requires `Interaction` plugin

On touch devices, how many milliseconds the user has to hold a finger before the selection starts. A shorter touch scrolls the calendar.

```js
let options = {
    selectLongPressDelay: 500
};
```
Without a value, [longPressDelay](../longpressdelay/) is used.
