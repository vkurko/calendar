- Type `object`
- Default `{start: 'title', center: '', end: 'today prev,next'}`

What the toolbar at the top of the calendar contains: the title and the buttons.

The value is an object with the `start`, `center` and `end` properties for the three parts of the toolbar. Each one is a string with the names of the items. The items separated by a comma are joined into a group, and the items separated by a space have a gap between them.

```js
let options = {
    headerToolbar: {
        start: 'prev,next today',
        center: 'title',
        end: 'dayGridMonth,timeGridWeek,timeGridDay'
    }
};
```
The following items are available, as well as the ones defined in [customButtons](../custombuttons/):
<table>
<tr>
<td>

`title`
</td>
<td>A text containing the current month/week/day</td>
</tr>
<tr>
<td>

`prev`
</td>
<td>A button for moving the calendar back one month/week/day</td>
</tr>
<tr>
<td>

`next`
</td>
<td>A button for moving the calendar forward one month/week/day</td>
</tr>
<tr>
<td>

`today`
</td>
<td>A button for moving the calendar to the current month/week/day</td>
</tr>
<tr>
<td>

_a view name like_ `dayGridMonth`
</td>
<td>A button that will switch the calendar to a specific view</td>
</tr>
</table>

The texts of the buttons are set with [buttonText](../buttontext/).
