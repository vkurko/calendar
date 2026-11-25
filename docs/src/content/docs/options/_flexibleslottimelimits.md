- Type `boolean` or `object`
- Default `false`

Extends [slotMinTime](../slotmintime/) and [slotMaxTime](../slotmaxtime/) automatically when an event of the shown period is outside of them, so that no event is cut off or hidden.

```js
let options = {
    slotMinTime: '09:00',
    slotMaxTime: '18:00',
    // An event at 7:30 makes the day start at 7:30
    flexibleSlotTimeLimits: true
};
```
With `true`, all the shown events are taken into account except the background ones. To decide it yourself, pass an object with the following properties instead:

<table>
<tr>
<td>

`eventFilter`
</td>
<td>

A function to determine whether a given event should be taken into account or not.

```js
function(event) {
    // return true or false
}
```
<table>
<tr>
<td>

`event`
</td>
<td>

[Event](../../event-object/) object to be analyzed.

The function must return `true` to have this event counted, or `false` to ignore it
</td>
</tr>
</table>

</td>
</tr>
</table>

```js
let options = {
    // Background events count as well
    flexibleSlotTimeLimits: {eventFilter: event => true}
};
```
