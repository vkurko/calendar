- Type `function`
- Default `undefined`
- Requires `Interaction` plugin

Called when the current selection is cleared. It happens when:

- the user clicks anywhere on the page, unless [unselectAuto](../unselectauto/) is `false`,
- the user makes a new selection, in which case it is called before the new selection is made,
- the calendar moves to another period or the view is switched,
- the [unselect()](../../methods/unselect/) method is called.

```js
let options = {
    selectable: true,
    unselect: ({view}) => {
        console.log('The selection is cleared in', view.type);
    }
};
```
The function receives an object with the following properties:
<table>
<tr>
<td>

`jsEvent`
</td>
<td>

JavaScript native event object with low-level information such as click coordinates.

If unselect has been triggered via the [unselect](../../methods/unselect/) method, jsEvent will be `undefined`</td>
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
