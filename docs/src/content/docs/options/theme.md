---
title: "theme"
description: "{allDay: 'ec-all-day', active: 'ec-active', bgEvent: 'ec-bg-event', bgEvents: 'ec-bg-events', body: 'ec-body', button: 'ec-button', buttonGroup:…"
---

- Type `object` or `function`
<ul>
<li>
<details>
    <summary>Default</summary>

`{allDay: 'ec-all-day', active: 'ec-active', bgEvent: 'ec-bg-event', bgEvents: 'ec-bg-events', body: 'ec-body', button: 'ec-button', buttonGroup: 'ec-button-group', calendar: 'ec', colHead: 'ec-col-head', day: 'ec-day', dayHead: 'ec-day-head', disabled: 'ec-disabled', endClipped: 'ec-end-clipped', event: 'ec-event', eventBody: 'ec-event-body', eventTime: 'ec-event-time', eventTitle: 'ec-event-title', events: 'ec-events', grid: 'ec-grid', header: 'ec-header', hidden: 'ec-hidden', highlight: 'ec-highlight', icon: 'ec-icon', lines: 'ec-lines', main: 'ec-main', noIeb: 'ec-no-ieb', noBeb: 'ec-no-beb', today: 'ec-today', title: 'ec-title', toolbar: 'ec-toolbar', view: 'ec-list ec-week-view', weekdays: ['ec-sun', ec-mon', ec-tue', ec-wed', ec-thu', ec-fri', ec-sat'], draggable: 'ec-draggable', ghost: 'ec-ghost', preview: 'ec-preview', pointer: 'ec-pointer', resizer: 'ec-resizer', start: 'ec-start', dragging: 'ec-dragging', resizingY: 'ec-resizing-y', resizingX: 'ec-resizing-x', selecting: 'ec-selecting', notAllowed: 'ec-not-allowed', startClipped: 'ec-start-clipped', uniform: 'ec-uniform', dayFoot: 'ec-day-foot', otherMonth: 'ec-other-month', popup: 'ec-popup', weekNumber: 'ec-week-number', daySide: 'ec-day-side', eventTag: 'ec-event-tag', noEvents: 'ec-no-events', nowIndicator: 'ec-now-indicator', sidebar: 'ec-sidebar', slot: 'ec-slot', colGroup: 'ec-col-group', expander: 'ec-expander', row: 'ec-row', rowHead: 'ec-row-head', slots: 'ec-slots'}`
> Views override the default value as follows:
> - dayGridDay `theme => ({...theme, view: 'ec-day-grid ec-day-view'})`
> - dayGridMonth `theme => ({...theme, view: 'ec-day-grid ec-month-view'})`
> - dayGridWeek `theme => ({...theme, view: 'ec-day-grid ec-week-view'})`
> - listDay `theme => ({...theme, view: 'ec-list ec-day-view'})`
> - listMonth `theme => ({...theme, view: 'ec-list ec-month-view'})`
> - listWeek `theme => ({...theme, view: 'ec-list ec-week-view'})`
> - listYear `theme => ({...theme, view: 'ec-list ec-year-view'})`
> - resourceTimeGridDay `theme => ({...theme, view: 'ec-resource ec-time-grid ec-day-view'})`
> - resourceTimeGridWeek `theme => ({...theme, view: 'ec-resource ec-time-grid ec-week-view'})`
> - resourceTimelineDay `theme => ({...theme, view: 'ec-resource ec-timeline ec-day-view'})`
> - resourceTimelineMonth `theme => ({...theme, view: 'ec-resource ec-timeline ec-month-view'})`
> - resourceTimelineWeek `theme => ({...theme, view: 'ec-resource ec-timeline ec-week-view'})`
> - resourceTimelineYear `theme => ({...theme, view: 'ec-resource ec-timeline ec-year-view'})`
> - timeGridDay `theme => ({...theme, view: 'ec-time-grid ec-day-view'})`
> - timeGridWeek `theme => ({...theme, view: 'ec-time-grid ec-week-view'})`
</details>
</li>
</ul>

The CSS classes the calendar puts on its elements. Change them to style the calendar with the classes of your own or of a CSS framework.

The value is an object with the classes, or a function that receives the default classes and returns the new ones. A function is the way to change some classes and keep the others:

```js
let options = {
    theme: theme => ({...theme, button: 'btn btn-outline-primary', today: 'ec-today my-today'})
};
```
An object replaces the default classes completely, so it has to contain all of them.
