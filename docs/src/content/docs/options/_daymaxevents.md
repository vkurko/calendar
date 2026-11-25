- Type `boolean`
- Default `false`

Limits the events of a day in the `dayGrid` views to those that fit into the height of the day cell. The rest are collected under a link like `+2 more`, which opens them in a popup.

It needs the calendar to have a [height](../height/): without one, as well as without this option, the rows of the grid grow to show all the events.

```js
let options = {
    view: 'dayGridMonth',
    height: '600px',
    dayMaxEvents: true
};
```
Only `true` is supported: the limit is set by the height of the cell, not by a number.
