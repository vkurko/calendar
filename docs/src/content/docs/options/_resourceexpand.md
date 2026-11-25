- Type `function`
- Default `undefined`

Called when the user expands or collapses a resource with nested children in the `resourceTimeline` views.

```js
let options = {
    resourceExpand: ({resource}) => {
        console.log(resource.title, resource.expanded);
    }
};
```
The function receives an object with the following properties:
<table>
<tr>
<td>

`resource`
</td>
<td>

The associated [Resource](../../resource-object/) object
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
