- Type `object` or `function`
- Default `{hour: 'numeric', minute: '2-digit'}`

The format of the time shown on an event.

The value is an object with the options of the native JavaScript [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat) object, or a function that returns the formatted [Content](../../content/).

```js
let options = {
    eventTimeFormat: {hour: '2-digit', minute: '2-digit', hour12: false}
    // or as a function
    // eventTimeFormat: (start, end) => start.toLocaleTimeString()
};
```
The function receives the following arguments:
<table>
<tr>
<td>

`start`
</td>
<td>JavaScript Date object containing the beginning of the time span to be formatted</td>
</tr>
<tr>
<td>

`end`
</td>
<td>JavaScript Date object containing the end of the time span to be formatted, or `null` if the end time is not displayed (see [displayEventEnd](../displayeventend/))</td>
</tr>
</table>
