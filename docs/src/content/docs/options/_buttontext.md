- Type `object` or `function`
<ul>
<li>
<details>
    <summary>Default</summary>

`{collapse: 'Collapse', close: 'Close', dayGridDay: 'day', dayGridMonth: 'month', dayGridWeek: 'week', expand: 'Expand', listDay: 'day', listMonth: 'month', listWeek: 'week', listYear: 'year', resourceTimeGridDay: 'day', resourceTimeGridWeek: 'week', resourceTimelineDay: 'day', resourceTimelineMonth: 'month', resourceTimelineWeek: 'week', resourceTimelineYear: 'year', timeGridDay: 'day', timeGridWeek: 'week', today: 'today'}`
> Views override the default value as follows:
> - dayGridDay `text => ({...text, next: 'Next day', prev: 'Previous day'})`
> - dayGridMonth `text => ({...text, next: 'Next month', prev: 'Previous month'})`
> - dayGridWeek `text => ({...text, next: 'Next week', prev: 'Previous week'})`
> - listDay `text => ({...text, next: 'Next day', prev: 'Previous day'})`
> - listMonth `text => ({...text, next: 'Next month', prev: 'Previous month'})`
> - listWeek `text => ({...text, next: 'Next week', prev: 'Previous week'})`
> - listYear `text => ({...text, next: 'Next year', prev: 'Previous year'})`
> - resourceTimeGridDay `text => ({...text, next: 'Next day', prev: 'Previous day'})`
> - resourceTimeGridWeek `text => ({...text, next: 'Next week', prev: 'Previous week'})`
> - resourceTimelineDay `text => ({...text, next: 'Next day', prev: 'Previous day'})`
> - resourceTimelineMonth `text => ({...text, next: 'Next month', prev: 'Previous month'})`
> - resourceTimelineWeek `text => ({...text, next: 'Next week', prev: 'Previous week'})`
> - resourceTimelineYear `text => ({...text, next: 'Next year', prev: 'Previous year'})`
> - timeGridDay `text => ({...text, next: 'Next day', prev: 'Previous day'})`
> - timeGridWeek `text => ({...text, next: 'Next week', prev: 'Previous week'})`

</details>
</li>
</ul>

The texts of the buttons of the calendar. For the buttons without a text — `prev` and `next` in the toolbar, `close` in the popup, `expand` and `collapse` at the nested resources — these are the labels for screen readers and the tooltips.

The value is an object with the texts, or a function that receives the default texts and returns the new ones. A function is the way to change some texts and keep the others:

```js
let options = {
    buttonText: text => ({...text, today: 'This week', dayGridMonth: 'Month'})
};
```
An object replaces the default texts completely, so it has to contain every text the calendar needs.
