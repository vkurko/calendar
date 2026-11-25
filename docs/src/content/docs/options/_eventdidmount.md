- Type `function`
- Default `undefined`

Called right after the element of an event is added to the page. This is the place to attach something to the element: a tooltip, for example.

```js
let options = {
    eventDidMount: ({event, el}) => {
        el.title = event.title;
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

`timeText`
</td>
<td>Formatted time of the event</td>
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

It is called once for each element. An element is created again, and the function is called again, when the event is replaced with [updateEvent()](../../methods/updateevent/), loaded again, or moved to another day or resource.
