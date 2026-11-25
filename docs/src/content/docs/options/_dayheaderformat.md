- Type `object` or `function`
- Default `{weekday: 'short', month: 'numeric', day: 'numeric'}`
> Views override the default value as follows:
> - dayGridDay `{weekday: 'long'}`
> - dayGridMonth `{weekday: 'short'}`
> - resourceTimeGridDay `{weekday: 'long'}`
> - resourceTimelineDay `{weekday: 'long'}`
> - resourceTimelineMonth `{weekday: 'short', day: 'numeric'}`
> - resourceTimelineYear `{weekday: 'short', day: 'numeric'}`
> - timeGridDay `{weekday: 'long'}`

The format of the column headings.

The value is an object with the options of the native JavaScript [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat) object, or a function that returns the formatted [Content](../../content/).

```js
let options = {
    dayHeaderFormat: {weekday: 'long'}
    // or as a function
    // dayHeaderFormat: date => date.toDateString()
};
```
The function receives the JavaScript Date object to format.
