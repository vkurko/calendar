- Type `function`
- Default `undefined`

Called when the mouse pointer enters an event.

```js
let options = {
    eventMouseEnter: ({event, el}) => {
        showTooltip(el, event.title);
    }
};
```
The function receives an object with the following properties:
<table>
<tr>
<td>

`el`
</td>
<td>The HTML element for the event</td>
</tr>
<tr>
<td>

`event`
</td>
<td>

The associated [Event](../../event-object/) object
</td>
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
</table>
