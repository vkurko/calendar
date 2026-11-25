- Type `boolean`
- Default `true`

Whether the resources with nested children are expanded or collapsed at first in the `resourceTimeline` views.

```js
let options = {
    // Start with all groups collapsed
    resourcesInitiallyExpanded: false
};
```
It applies to the resources that have no `expanded` property of their own and that the user has not expanded or collapsed yet.
