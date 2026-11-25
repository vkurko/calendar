- Type `object`
- Default `{}`

The options that apply to one view only, and the views of your own.

The value is an object where each key is the name of a view and each value is an object with the options for it:

```js
let options = {
    views: {
        // Another format of the time in the month view
        dayGridMonth: {eventTimeFormat: {hour: 'numeric'}},
        // A new view: three days of the timeline
        resourceTimelineThreeDays: {
            type: 'resourceTimelineDay',
            duration: {days: 3}
        }
    }
};
```
A name that is not a standard view defines a new view. Its `type` is the standard view it is based on and takes the options from. The new view is then used like any other: in the [view](../view/) option and in the [headerToolbar](../headertoolbar/). The text of its button is set in [buttonText](../buttontext/) under the name of the view.

This option is only read when the calendar is created. Changing it afterwards, either with [setOption](../../methods/setoption/) or reactively in Svelte, has no effect.
