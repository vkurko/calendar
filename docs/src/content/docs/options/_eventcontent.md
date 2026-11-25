- Type `Content` or `function`
- Default `undefined`

The content of an event, in place of the default time and title.

The value is a [Content](../../content/), or a function that returns it:

```js
let options = {
    eventContent: ({event, timeText}) => ({
        html: `<div class="ec-event-time">${timeText}</div><div class="ec-event-title">★ ${event.title}</div>`
    })
};
```
The function receives an object with the following properties:
<table>
<tr>
<td>

`event`
</td>
<td>

The associated [Event](../../event-object/) object
</td>
</tr>
<tr>
<td>

`timeText`
</td>
<td>Formatted time of the event</td>
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

If the function returns `undefined`, the event gets the default content, so the content can be changed for some events only.

The event itself does not clip its content: the default time and title are clipped by their own `ec-event-time` and `ec-event-title` classes. Use the same classes for your content, as in the example, so that it does not stick out of an event that is too small for it.

In Svelte, React, Vue and Angular this content can be rendered by the framework itself: with a [snippet](../../usage/#rendering-content), [JSX](../../usage/#rendering-content), a [slot](../../usage/#rendering-content) or a [template](../../usage/#rendering-content).
