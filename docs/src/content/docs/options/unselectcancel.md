---
title: "unselectCancel"
description: "A CSS selector for the elements that do not clear the selection when clicked, while unselectAuto is on. For example, a form where the user enters the…"
---

- Type `string`
- Default `''`
- Requires `Interaction` plugin

A CSS selector for the elements that do not clear the selection when clicked, while [unselectAuto](../unselectauto/) is on. For example, a form where the user enters the details of the selected time.

```js
let options = {
    selectable: true,
    unselectCancel: '.event-form'
};
```
