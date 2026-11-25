- Type `object` or `function`
- Default `{weekday: 'long'}`

The format of the text on the left side of the day headings in the `list` views.

The value is an object with the options of the native JavaScript [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat) object, or a function that returns the formatted [Content](../../content/).

```js
let options = {
    listDayFormat: {weekday: 'short'}
    // or as a function
    // listDayFormat: date => date.toDateString()
};
```
The function receives the JavaScript Date object to format.
