---
title: "longPressDelay"
description: "On touch devices, how many milliseconds the user has to hold a finger before an event can be dragged or resized, or a date range can be selected. A shorter…"
---

- Type `integer`
- Default `1000`

On touch devices, how many milliseconds the user has to hold a finger before an event can be dragged or resized, or a date range can be selected. A shorter touch scrolls the calendar.

```js
let options = {
    longPressDelay: 500
};
```
To set it separately for the events and for the selection, use [eventLongPressDelay](../eventlongpressdelay/) and [selectLongPressDelay](../selectlongpressdelay/).
