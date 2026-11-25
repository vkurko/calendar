---
title: "Event object"
description: "This is a JavaScript object that EventCalendar uses to store information about a calendar event."
---

This is a JavaScript object that EventCalendar uses to store information about a calendar event.

Here are all properties that exist in Event object:
<table>
<tr>
<td>

`id`
</td>
<td>A unique string identifier of the event</td>
</tr>
<tr>
<td>

`resourceIds`
</td>
<td>An array of resource IDs that the event is associated with</td>
</tr>
<tr>
<td>

`allDay`
</td>
<td>

`true` or `false`. Determines if the event is shown in the `all-day` slot</td>
</tr>
<tr>
<td>

`start`
</td>
<td>JavaScript Date object holding the event’s start time</td>
</tr>
<tr>
<td>

`end`
</td>
<td>JavaScript Date object holding the event’s end time</td>
</tr>
<tr>
<td>

`title`
</td>
<td>

`Content` The text appearing on the event. See [Content](../content/)</td>
</tr>
<tr>
<td>

`editable`
</td>
<td>

`true`, `false` or `undefined`. The value overriding the [editable](../options/editable/) setting for this specific event
</td>
</tr>
<tr>
<td>

`startEditable`
</td>
<td>

`true`, `false` or `undefined`. The value overriding the [eventStartEditable](../options/eventstarteditable/) setting for this specific event
</td>
</tr>
<tr>
<td>

`durationEditable`
</td>
<td>

`true`, `false` or `undefined`. The value overriding the [eventDurationEditable](../options/eventdurationeditable/) setting for this specific event
</td>
</tr>
<tr>
<td>

`display`
</td>
<td>

The rendering type of the event. Can be `'auto'` or `'background'`

In month-based views such as `dayGridMonth` or `resourceTimelineMonth`, background events are displayed only if their `allDay` property is set to `true`

In addition, in your callback functions, you may get the `'ghost'`, `'preview'` and `'pointer'` for this property, which are internal values and are used, for example, to display events during drag-and-drop operations
</td>
</tr>
<tr>
<td>

`layoutGroup`
</td>
<td>

The layout group the event belongs to

Events of the same layout group within a resource row are laid out as a unit, at the place of the first of them in `eventOrder`: they take a rectangle from the start of the first one to the end of the last one, and no other event is placed inside it. Within the group, events are laid out among themselves the same way as the groups are laid out in the row, depending on [eventOrderStrict](../options/eventorderstrict/). Only applies in `resourceTimeline` views
</td>
</tr>
<tr>
<td>

`backgroundColor`
</td>
<td>

The [eventBackgroundColor](../options/eventbackgroundcolor/) override for this specific event
</td>
</tr>
<tr>
<td>

`textColor`
</td>
<td>

The [eventTextColor](../options/eventtextcolor/) override for this specific event
</td>
</tr>
<tr>
<td>

`classNames`
</td>
<td>

An array of additional CSS classes for this specific event
</td>
</tr>
<tr>
<td>

`styles`
</td>
<td>

An array of additional inline styling declarations for this specific event
</td>
</tr>
<tr>
<td>

`extendedProps`
</td>
<td>

A plain object holding miscellaneous properties specified during parsing in the explicitly given `extendedProps` field
</td>
</tr>
</table>

## Parsing event from a plain object
When EventCalendar receives an array of plain event’s objects either from the `events` option or as a result of an HTTP request to a URL of an event source, it parses the input objects into proper Event objects.

An input object without `start` can't be parsed, such an event is not added to the calendar.

Here are all admissible fields for the event’s input object:
<table>
<tr>
<td>

`id`
</td>
<td>

`string` or `integer` A unique identifier of the event. Default `auto-generated value`
</td>
</tr>
<tr>
<td>

`allDay`
</td>
<td>

`boolean` Determines if the event is shown in the all-day slot. Defaults to `true` if `start` and `end` are both passed without a time part, `false` otherwise
</td>
</tr>
<tr>
<td>

`start`
</td>
<td>

`string` or `Date` This should be either an ISO8601 datetime string like `'2026-12-31 09:00:00'`, or a JavaScript Date object holding the event’s start time
</td>
</tr>
<tr>
<td>

`end`
</td>
<td>

`string` or `Date` This should be either an ISO8601 datetime string like `'2026-12-31 13:00:00'`, or a JavaScript Date object holding the event’s end time. If omitted, the event ends at its start, an all-day event lasts one day
</td>
</tr>
<tr>
<td>

`title`
</td>
<td>

`Content` The text that will appear on the event. See [Content](../content/). Default `''`
</td>
</tr>
<tr>
<td>

`editable`
</td>
<td>

`boolean` Overrides the master [editable](../options/editable/) option for this single event. Default `undefined`
</td>
</tr>
<tr>
<td>

`startEditable`
</td>
<td>

`boolean` Overrides the master [eventStartEditable](../options/eventstarteditable/) option for this single event. Default `undefined`
</td>
</tr>
<tr>
<td>

`durationEditable`
</td>
<td>

`boolean` Overrides the master [eventDurationEditable](../options/eventdurationeditable/) option for this single event. Default `undefined`
</td>
</tr>
<tr>
<td>

`resourceIds` or `resourceId`
</td>
<td>

`string`, `integer` or `array`  An ID of a resource or an array of resource IDs that the event is associated with. Default `[]`
</td>
</tr>
<tr>
<td>

`display`
</td>
<td>

`string` The rendering type of the event. Can be `'auto'` or `'background'`. Default `'auto'`

In month-based views such as `dayGridMonth` or `resourceTimelineMonth`, background events are displayed only if their `allDay` property is set to `true`
</td>
</tr>
<tr>
<td>

`layoutGroup`
</td>
<td>

`string` or `number` The layout group the event belongs to. Events of the same layout group within a resource row are laid out as a unit, at the place of the first of them in `eventOrder`: they take a rectangle from the start of the first one to the end of the last one, and no other event is placed inside it. Within the group, events are laid out among themselves the same way as the groups are laid out in the row, depending on [eventOrderStrict](../options/eventorderstrict/). Only applies in `resourceTimeline` views
</td>
</tr>
<tr>
<td>

`backgroundColor`
</td>
<td>

`string` Sets the event’s background color just like the calendar-wide [eventBackgroundColor](../options/eventbackgroundcolor/) option. Default `undefined`
</td>
</tr>
<tr>
<td>

`textColor`
</td>
<td>

`string` Sets the event’s text color just like the calendar-wide [eventTextColor](../options/eventtextcolor/) option. Default `undefined`
</td>
</tr>
<tr>
<td>

`color`
</td>
<td>

`string` This is currently an alias for the `backgroundColor` field. Default `undefined`
</td>
</tr>
<tr>
<td>

`classNames` or `className`
</td>
<td>

`string` or `array` Sets additional CSS classes for this single event. See [eventClassNames](../options/eventclassnames/). Default `[]`
</td>
</tr>
<tr>
<td>

`styles` or `style`
</td>
<td>

`string` or `array` Sets additional inline styling declarations for this single event. This value can be either a string containing styles `'font-size: 24px; border-radius: 4px; ...'` or an array of strings `['font-size: 24px', 'border-radius: 4px', ...]`. Default `[]`
</td>
</tr>
<tr>
<td>

`extendedProps`
</td>
<td>

`object` A plain object with any miscellaneous properties. It will be directly transferred to the `extendedProps` property of the Event object. Default `{}`
</td>
</tr>
</table>
