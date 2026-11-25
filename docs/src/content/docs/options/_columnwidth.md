- Type `string`
- Default `undefined`

The width of the day columns in the `timeGrid` and `resourceTimeGrid` views, and in the `resourceTimeline` views whose slots are days, such as `resourceTimelineMonth`.

By default the columns share the width of the calendar. With this option each column gets the given width, and the calendar is scrolled horizontally when the columns do not fit.

The value is a CSS [length](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/grid-template-columns#values), so include the unit:

```js
let options = {
    columnWidth: '150px'
};
```
