- Type `function`
- Default `undefined`

Decides which events are shown, without changing the events themselves. The function is called for each event and returns `true` to show it:

```js
let options = {
    // Only the events of the selected category
    eventFilter: ({event}) => event.extendedProps.category === 'work'
};
```
The function receives an object with the following properties:
<table>
<tr>
<td>

`event`
</td>
<td>

The current [Event](../../event-object/) object being processed in the array
</td>
</tr>
<tr>
<td>

`index`
</td>
<td>The index of the current event being processed in the array</td>
</tr>
<tr>
<td>

`events`
</td>
<td>

The array of all events `eventFilter` was called upon
</td>
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

The filter is applied again when the view changes, so the events can be different in each view.
