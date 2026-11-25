- Type `boolean`
- Default `false`

Shows the numbers of the weeks in the `dayGrid` and `resourceTimeline` views. A timeline of exactly one week does not show it.

```js
let options = {
    weekNumbers: true
};
```
The numbering depends on [firstDay](../firstday/): with `0` the [Western](https://en.wikipedia.org/wiki/Week#Other_week_numbering_systems) system is used, and with any other value the [ISO](https://en.wikipedia.org/wiki/Week#The_ISO_week_date_system) one.
