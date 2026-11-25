- Type `object` or `function`
- Default `{hour: 'numeric', minute: '2-digit'}`

The format of the time labels of the slots.

The value is an object with the options of the native JavaScript [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat) object, or a function that returns the formatted [Content](../../content/).

```js
let options = {
    slotLabelFormat: {hour: '2-digit', minute: '2-digit', hour12: false}
    // or as a function
    // slotLabelFormat: time => time.toLocaleTimeString()
};
```
The function receives the JavaScript Date object to format.
