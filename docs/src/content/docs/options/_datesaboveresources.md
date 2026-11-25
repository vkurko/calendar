- Type `boolean`
- Default `false`

Puts the days above the resources in the `resourceTimeGrid` views: the columns are grouped by day, and each day holds a column per resource.

By default it is the other way around: the columns are grouped by resource, and each resource holds its days.

```js
let options = {
    view: 'resourceTimeGridWeek',
    datesAboveResources: true
};
```
