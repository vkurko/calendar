- Type `function`
- Default `undefined`

Called when the period the calendar shows is set or changed: when the calendar is created and each time it moves to other dates, by navigation or by switching to a view of another period.

```js
let options = {
    datesSet: ({start, end, view}) => {
        console.log(view.type, start, end);
    }
};
```
The function receives an object with the following properties:
<table>
<tr>
<td>

`start`
</td>
<td>JavaScript Date object for the beginning of the range the calendar needs events for</td>
</tr>
<tr>
<td>

`end`
</td>
<td>JavaScript Date object for the end of the range the calendar needs events for. Note: This value is exclusive</td>
</tr>
<tr>
<td>

`startStr`
</td>
<td>ISO8601 string representation of the start date</td>
</tr>
<tr>
<td>

`endStr`
</td>
<td>ISO8601 string representation of the end date</td>
</tr>
<tr>
<td>

`view`
</td>
<td>

The current [View](../../view-object/) object
</td>
</tr>
</table>
