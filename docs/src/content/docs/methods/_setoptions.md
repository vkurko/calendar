- Parameters
  - `options` `object` The option names and their new values
- Return value `EventCalendar` The calendar instance for chaining

This method allows you to set several calendar options at once. An option with the `undefined` value is reset to its default value.

```js
ec.setOptions({
    view: 'timeGridDay',
    slotDuration: '00:15'
});
```
