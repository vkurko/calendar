- Type `string`, `array` or `function`
- Default `undefined`

Additional CSS classes for the elements of the events.

The value is a string with the class names, an array of them, or a function that returns either:

```js
let options = {
    eventClassNames: ({event}) => event.extendedProps.urgent ? ['urgent', 'bold'] : 'regular'
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

`view`
</td>
<td>

The current [View](../../view-object/) object
</td>
</tr>
</table>
