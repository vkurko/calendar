- Type `function`
- Default `undefined`
- Requires `Interaction` plugin

Called when the user stops resizing an event.

```js
let options = {
    eventResizeStop: ({event}) => {
        console.log('Released', event.title);
    }
};
```
The function receives an object with the following properties:
<table>
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

At this moment the event is not changed yet. Unless the new size is refused, the event is changed after this call, and then [eventResize](../eventresize/) is called.
