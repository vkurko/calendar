- Type `Content` or `function`
- Default `undefined`

The content of the day cells. In the `dayGrid` views it replaces the number of the day and in the `list` views the name of the day. In the other views the cells have no content by default.

The value is a [Content](../../content/), or a function that returns it:

```js
let options = {
    dayCellContent: ({date, isToday}) => ({html: isToday ? '<b>Today</b>' : String(date.getDate())})
};
```
The function receives an object with the following properties:
<table>
<tr>
<td>

`allDay`
</td>
<td>

`true` or `false`. Determines if the cell is within `all-day` slot. Month and list views are also considered as all-day slots
</td>
</tr>
<tr>
<td>

`date`
</td>
<td>JavaScript Date object corresponding to the day</td>
</tr>
<tr>
<td>

`isToday`
</td>
<td>

`true` or `false`. Determines if the cell is for today
</td>
</tr>
<tr>
<td>

`resource`
</td>
<td>

If the current view is a resource view, the [Resource](../../resource-object/) object that owns this cell
</td>
</tr>
</table>

In Svelte, React, Vue and Angular this content can be rendered by the framework itself: with a [snippet](../../usage/#rendering-content), [JSX](../../usage/#rendering-content), a [slot](../../usage/#rendering-content) or a [template](../../usage/#rendering-content).
