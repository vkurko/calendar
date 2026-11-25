- Type `object` or `function`
- Default `{month: 'long', day: 'numeric', year: 'numeric'}`

The format of the date in the title of the popup that the `+more` link opens, see [dayMaxEvents](../daymaxevents/).

The value is an object with the options of the native JavaScript [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat) object, or a function that returns the formatted [Content](../../content/).

```js
let options = {
    dayPopoverFormat: {weekday: 'long', month: 'long', day: 'numeric'}
    // or as a function
    // dayPopoverFormat: date => date.toDateString()
};
```
The function receives the JavaScript Date object to format.
