- Type `string`, `integer` or `object`
- Default `{weeks: 1}`
> Views override the default value as follows:
> - dayGridDay `{days: 1}`
> - dayGridMonth `{months: 1}`
> - listDay `{days: 1}`
> - listMonth `{months: 1}`
> - listYear `{years: 1}`
> - resourceTimeGridDay `{days: 1}`
> - resourceTimelineDay `{days: 1}`
> - resourceTimelineMonth `{months: 1}`
> - resourceTimelineYear `{years: 1}`
> - timeGridDay `{days: 1}`

The period of time a view shows.

The value is anything that can be [parsed into a Duration](../../duration-object/#parsing-duration-from-input-values) object.

```js
let options = {
    view: 'timeGridWeek',
    // Four days instead of a week
    duration: {days: 4}
};
```
Usually it is set for a view of your own in the [views](../views/) option.
