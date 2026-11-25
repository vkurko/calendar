- Type `function`
- Default `undefined`

Called right after a view is added to the page: when the calendar is created and each time the view is switched.

```js
let options = {
    viewDidMount: ({view}) => {
        console.log('Now showing', view.type);
    }
};
```
The function receives an object with the following properties:
<table>
<tr>
<td>

`view`
</td>
<td>

The mounted [View](../../view-object/) object
</td>
</tr>
</table>
