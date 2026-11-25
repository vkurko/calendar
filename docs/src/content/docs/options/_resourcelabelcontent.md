- Type `string`, `object` or `function`
- Default `undefined`

The content of a resource label, in place of the title of the resource.

The value is a [Content](../../content/), or a function that returns it:

```js
let options = {
    resourceLabelContent: ({resource}) => ({html: `<b>${resource.title}</b>`})
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

`date`
</td>
<td>If it is a column that is within a specific date, this will be a Date object</td>
</tr>
</table>

In Svelte, React, Vue and Angular this content can be rendered by the framework itself: with a [snippet](../../usage/#rendering-content), [JSX](../../usage/#rendering-content), a [slot](../../usage/#rendering-content) or a [template](../../usage/#rendering-content).
