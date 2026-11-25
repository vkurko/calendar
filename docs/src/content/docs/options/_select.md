- Type `function`
- Default `undefined`
- Requires `Interaction` plugin

Called when the user has selected a range of dates or time. The selection is enabled with [selectable](../selectable/).

```js
let options = {
    selectable: true,
    select: ({start, end, allDay, resource}) => {
        console.log(start, end, allDay, resource?.title);
    }
};
```
The function receives an object with the following properties:
<table>
<tr>
<td>

`start`
</td>
<td>JavaScript Date object indicating the start of the selection</td>
</tr>
<tr>
<td>

`end`
</td>
<td>JavaScript Date object indicating the end of the selection</td>
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

`allDay`
</td>
<td>

`true` or `false`. Determines if the selection has occurred in the `all-day` slot</td>
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

If the current view is a resource view, the [Resource](../../resource-object/) object that was selected
</td>
</tr>
</table>

The selection stays highlighted until the user clicks anywhere on the page or [unselect()](../../methods/unselect/) is called.
