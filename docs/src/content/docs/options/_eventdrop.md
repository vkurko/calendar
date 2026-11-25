- Type `function`
- Default `undefined`
- Requires `Interaction` plugin

Called when the user has dropped an event and the drop is accepted. The event is already changed at this moment. It is called even if the event is dropped where it was.

```js
let options = {
    eventDrop: async ({event, oldEvent, revert}) => {
        let saved = await save(event.id, event.start, event.end);
        if (!saved) {
            // Put the event back
            revert();
        }
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

`oldEvent`
</td>
<td>

An [Event](../../event-object/) object that holds information about the event before the drop
</td>
</tr>
<tr>
<td>

`oldResource`
</td>
<td>

If the resource has changed, this is the [Resource](../../resource-object/) object the event came from. If the resource has not changed, this will be undefined
</td>
</tr>
<tr>
<td>

`newResource`
</td>
<td>

If the resource has changed, this is the [Resource](../../resource-object/) object the event went to. If the resource has not changed, this will be undefined
</td>
</tr>
<tr>
<td>

`delta`
</td>
<td>

A [Duration](../../duration-object/) object that represents the amount of time the event was moved by
</td>
</tr>
<tr>
<td>

`revert`
</td>
<td>

A function that, if called, reverts the event’s start/end date to the values before the drag
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

It is called after [eventDragStop](../eventdragstop/).
