- Type `object` or `function`
- Default `{year: 'numeric', month: 'short', day: 'numeric'}`
> Views override the default value as follows:
> - dayGridMonth `{year: 'numeric', month: 'long'}`
> - listDay `{year: 'numeric', month: 'long', day: 'numeric'}`
> - listMonth `{year: 'numeric', month: 'long'}`
> - listYear `{year: 'numeric'}`
> - resourceTimelineDay `{year: 'numeric', month: 'long', day: 'numeric'}`
> - resourceTimelineMonth `{year: 'numeric', month: 'long'}`
> - resourceTimelineYear `{year: 'numeric'}`
> - timeGridDay `{year: 'numeric', month: 'long', day: 'numeric'}`

The format of the title in the toolbar, which is the period the calendar shows.

The value is an object with the options of the native JavaScript [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat) object, or a function that returns the formatted [Content](../../content/).

```js
let options = {
    titleFormat: {year: 'numeric', month: 'long'}
    // or as a function
    // titleFormat: (start, end) => start.toDateString() + ' – ' + end.toDateString()
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
<td>JavaScript Date object containing the end of the time span to be formatted</td>
</tr>
</table>
