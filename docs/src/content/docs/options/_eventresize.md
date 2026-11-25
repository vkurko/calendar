- Type `function`
- Default `undefined`
- Requires `Interaction` plugin

Called when the user has finished resizing an event and the new size is accepted. The event is already changed at this moment.

```js
let options = {
    eventResize: async ({event, revert}) => {
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

An [Event](../../event-object/) object that holds information about the event before the resize
</td>
</tr>
<tr>
<td>

`startDelta`
</td>
<td>

A [Duration](../../duration-object/) object that represents the amount of time the event’s start date was moved by
</td>
</tr>
<tr>
<td>

`endDelta`
</td>
<td>

A [Duration](../../duration-object/) object that represents the amount of time the event’s end date was moved by
</td>
</tr>
<tr>
<td>

`revert`
</td>
<td>

A function that, if called, reverts the event’s end date to the values before the resize
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

It is called after [eventResizeStop](../eventresizestop/).
