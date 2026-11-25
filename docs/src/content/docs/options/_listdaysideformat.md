- Type `object` or `function`
- Default `{year: 'numeric', month: 'long', day: 'numeric'}`

The format of the text on the right side of the day headings in the `list` views.

The value is an object with the options of the native JavaScript [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat) object, or a function that returns the formatted [Content](../../content/).

```js
let options = {
    listDaySideFormat: {month: 'short', day: 'numeric'}
    // or as a function
    // listDaySideFormat: date => date.toDateString()
};
```
The function receives the JavaScript Date object to format.
