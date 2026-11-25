- Type `string`
- Default `undefined`

The default text color of the events. It is not used in the `list` views.

The value is any CSS color, such as `'#f00'`, `'rgb(255,0,0)'` or `'red'`:

```js
let options = {
    eventTextColor: '#fff'
};
```
The color of a [resource](../../resource-object/) and the color of the [event](../../event-object/) itself take precedence over this option.
