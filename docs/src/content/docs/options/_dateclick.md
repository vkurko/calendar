- Type `function`
- Default `undefined`
- Requires `Interaction` plugin

Called when the user clicks a day or a time slot.

```js
let options = {
    dateClick: ({date, allDay, resource}) => {
        console.log(date, allDay, resource?.title);
    }
};
```
The function receives an object with the following properties:
<table>
<tr>
<td>

`date`
</td>
<td>JavaScript Date object for the clicked date and time</td>
</tr>
<tr>
<td>

`dateStr`
</td>
<td>ISO8601 string representation of the date</td>
</tr>
<tr>
<td>

`allDay`
</td>
<td>

`true` or `false`. Determines if the click has occurred in the `all-day` slot. Month and list views are also considered as all-day slots</td>
</tr>
<tr>
<td>

`dayEl`
</td>
<td>HTML element that represents the whole-day that was clicked on</td>
</tr>
<tr>
<td>

`jsEvent`
</td>
<td>JavaScript native event object with low-level information such as click coordinates</td>
</tr>
<tr>
<td>

`view`
</td>
<td>

The current [View](../../view-object/) object
</td>
</tr>
<tr>
<td>

`resource`
</td>
<td>

If the current view is a resource view, the [Resource](../../resource-object/) object that owns this date
</td>
</tr>
</table>
