- Type `boolean`
- Default `false`

Hides the events that do not belong to any of the [resources](../resources/) in the `dayGrid`, `timeGrid` and `list` views. These views do not show the resources themselves, so by default they show all the events.

```js
let options = {
    view: 'timeGridWeek',
    resources: [{id: 1, title: 'Room A'}],
    // Only the events of Room A are shown
    filterEventsWithResources: true
};
```
