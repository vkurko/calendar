- Type `Content` or `function`
- Default `undefined`

The content of the link that replaces the events that do not fit into a day, instead of the default `+2 more`. See [dayMaxEvents](../daymaxevents/).

The value is a [Content](../../content/), or a function that returns it:

```js
let options = {
    moreLinkContent: ({num}) => `${num} hidden`
};
```
The function receives an object with the following properties:
<table>
<tr>
<td>

`num`
</td>
<td>The number of hidden events</td>
</tr>
<tr>
<td>

`text`
</td>
<td>

The default text like `+2 more`
</td>
</tr>
</table>

In Svelte, React, Vue and Angular this content can be rendered by the framework itself: with a [snippet](../../usage/#rendering-content), [JSX](../../usage/#rendering-content), a [slot](../../usage/#rendering-content) or a [template](../../usage/#rendering-content).
