- Type `object` or `function`
- Default `{day: 'numeric'}`

The format of the day number in the cells of the `dayGrid` views.

The value is an object with the options of the native JavaScript [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat) object, or a function that returns the formatted [Content](../../content/).

```js
let options = {
    dayCellFormat: {day: '2-digit'}
    // or as a function
    // dayCellFormat: date => String(date.getDate())
};
```
The function receives the JavaScript Date object to format.
