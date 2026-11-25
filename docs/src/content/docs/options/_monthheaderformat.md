- Type `object` or `function`
- Default `{month: 'long'}`

The format of the month headings in the `resourceTimelineMonth` and `resourceTimelineYear` views.

The value is an object with the options of the native JavaScript [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat) object, or a function that returns the formatted [Content](../../content/).

```js
let options = {
    monthHeaderFormat: {month: 'short', year: 'numeric'}
    // or as a function
    // monthHeaderFormat: date => date.toDateString()
};
```
The function receives the JavaScript Date object to format.

The row of the month headings is hidden when the view shows exactly one whole month, since the month is already in the title of the calendar.
