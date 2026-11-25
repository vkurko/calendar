- Type `function`
- Default `undefined`

Called when the calendar has finished rendering the events after they change: when they are loaded, added, changed or removed, and when the view is switched.

```js
let options = {
    eventAllUpdated: ({view}) => {
        console.log('The events are rendered in', view.type);
    }
};
```
The function receives an object with the following properties:
<table>
<tr>
<td>

`view`
</td>
<td>

The current [View](../../view-object/) object
</td>
</tr>
</table>

This is an experimental feature, and its behavior may change in the future.
