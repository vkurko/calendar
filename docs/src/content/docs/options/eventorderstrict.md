---
title: "eventOrderStrict"
description: "Makes the resourceTimeline views keep the order of the events vertically, even if it takes more space."
---

- Type `boolean`
- Default `false`

Makes the `resourceTimeline` views keep the order of the events vertically, even if it takes more space.

By default the layout is compact: an event is placed into the topmost free line, so it can end up above an event that comes before it in the order, when there is free space above that one. With `true`, an event is never placed above another event that comes before it in [eventOrder](../eventorder/) and overlaps it.

```js
let options = {
    eventOrderStrict: true
};
```
It is useful when a parent event has to stay above its children: order them so that the parent comes first, and enable this option.

The events that do not overlap are still laid out independently. To keep related events on the same line, give them the same `layoutGroup`.
