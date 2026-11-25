- Parameters
  - `name` `string` The option name
  - `value` `mixed` The new option value
- Return value `EventCalendar` The calendar instance for chaining

This method allows you to set new value to any calendar option. If `value` is `undefined`, the option is reset to its default value.

```js
// E.g. Change the current date
ec.setOption('date', new Date());
```
