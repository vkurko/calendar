- Type `object` or `function`
- Default `{}`

Your own buttons and other items for the [headerToolbar](../headertoolbar/).

Define the items under any names, then put the names into `headerToolbar`:

```js
let options = {
    customButtons: {
        myCustomButton: {
            text: 'custom!',
            click: function() {
                alert('clicked the custom button!');
            }
        }
    },
    headerToolbar: {
        start: 'title myCustomButton',
        center: '',
        end: 'today prev,next'
    }
};
```
An item accepts the following properties:
<table>
<tr>
<td>

`text`
</td>
<td>

The text to be displayed on the button itself. See [Content](../../content/)
</td>
</tr>
<tr>
<td>

`click`
</td>
<td>A callback function that is called when the button is clicked. Accepts one argument <a href="https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent">mouseEvent</a></td>
</tr>
<tr>
<td>

`active`
</td>
<td>

If `true`, the button will appear pressed/active
</td>
</tr>
<tr>
<td>

`content`
</td>
<td>

Arbitrary content displayed in place of the button. See [Content](../../content/)

This value can be either a [Content](../../content/) or a function that returns content:

```js
function () {
  // return Content
}
```
</td>
</tr>
</table>

An item with `content` is rendered as a `<div>` instead of a `<button>`, so it can hold any widget, such as an input or a select. It needs neither `text` nor `click`, and if both `content` and `text` are given, `content` is used.

```js
let input = document.createElement('input');

let options = {
    customButtons: {
        myFilter: {
            content: {domNodes: [input]}
        }
    },
    headerToolbar: {
        start: 'prev,next today',
        center: 'title',
        end: 'myFilter'
    }
};
```
In Svelte, React, Vue and Angular this content can be rendered by the framework itself: with a [snippet](../../usage/#rendering-content), [JSX](../../usage/#rendering-content), a [slot](../../usage/#rendering-content) or a [template](../../usage/#rendering-content).

The option can also be a function that receives the default items and returns the new ones:

```js
let options = {
    customButtons: buttons => ({...buttons, myCustomButton: {text: 'custom!', click: () => alert('clicked!')}})
};
```
