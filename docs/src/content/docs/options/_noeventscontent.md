- Type `Content` or `function`
- Default `'No events'`

What a `list` view shows when it has no events.

The value is a [Content](../../content/), or a function that returns it:

```js
let options = {
    noEventsContent: {html: '<i>Nothing is planned</i>'}
};
```
In Svelte, React, Vue and Angular this content can be rendered by the framework itself: with a [snippet](../../usage/#rendering-content), [JSX](../../usage/#rendering-content), a [slot](../../usage/#rendering-content) or a [template](../../usage/#rendering-content).
