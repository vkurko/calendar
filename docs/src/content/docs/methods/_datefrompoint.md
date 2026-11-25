- Return value `object` or `null`

Returns an `info` object with data as if the [dateClick](../../options/dateclick/) event had fired for that point.

`info` object contains the following properties:
<table>
<tr>
<td>

`date`
</td>
<td>JavaScript Date object for the date and time</td>
</tr>
<tr>
<td>

`allDay`
</td>
<td>

`true` or `false`. Determines if the point is in the `all-day` slot. Month and list views are also considered as all-day slots</td>
</tr>
<tr>
<td>

`dayEl`
</td>
<td>HTML element that represents the whole-day that contains the point</td>
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

Using this method, you can, for example, find out on which day a click occurred inside a multi-day event. To do this, inside [eventClick](../../options/eventclick/), pass the `jsEvent.clientX` and `jsEvent.clientY` coordinates to `dateFromPoint` and get the desired date.
