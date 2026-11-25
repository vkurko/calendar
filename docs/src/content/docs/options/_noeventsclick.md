- Type `function`
- Default `undefined`

Called when the user clicks the empty area of a `list` view that has no events to show.

```js
let options = {
    noEventsClick: ({view}) => {
        console.log('Nothing in', view.title);
    }
};
```
The function receives an object with the following properties:
<table>
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
