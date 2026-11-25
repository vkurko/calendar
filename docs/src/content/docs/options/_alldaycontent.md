- Type `Content` or `function`
- Default `'all-day'`

The title of the all-day row.

The value is a [Content](../../content/), or a function that returns it:

```js
let options = {
    allDayContent: ({text}) => ({html: `<i>${text}</i>`})
};
```
The function receives an object with the following properties:
<table>
<tr>
<td>

`text`
</td>
<td>

The default text
</td>
</tr>
</table>

In Svelte, React, Vue and Angular this content can be rendered by the framework itself: with a [snippet](../../usage/#rendering-content), [JSX](../../usage/#rendering-content), a [slot](../../usage/#rendering-content) or a [template](../../usage/#rendering-content).
