---
title: "refetchResourcesOnNavigate"
description: "Loads the resources again when the calendar moves to another period, so that each period can have its own resources. By default the resources are loaded once."
---

- Type `boolean`
- Default `false`

Loads the [resources](../resources/) again when the calendar moves to another period, so that each period can have its own resources. By default the resources are loaded once.

```js
let options = {
    resources: {url: '/resources'},
    refetchResourcesOnNavigate: true
};
```
The request then contains the period the resources are needed for. Whether a period that is already loaded is requested again depends on [lazyFetching](../lazyfetching/).
