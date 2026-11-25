- Type `Content` or `function`
- Default `undefined`

The content shown in place of the week number, which is `W01` by default. See [weekNumbers](../weeknumbers/).

The value is a [Content](../../content/), or a function that returns it:

```js
let options = {
    weekNumbers: true,
    weekNumberContent: ({week}) => `Week ${week}`
};
```
The function receives an object with the following properties:
<table>
<tr>
<td>

`date`
</td>
<td>JavaScript Date object containing the day within which the week number will be displayed</td>
</tr>
<tr>
<td>

`week`
</td>
<td>Calculated week number</td>
</tr>
</table>

In Svelte, React, Vue and Angular this content can be rendered by the framework itself: with a [snippet](../../usage/#rendering-content), [JSX](../../usage/#rendering-content), a [slot](../../usage/#rendering-content) or a [template](../../usage/#rendering-content).
