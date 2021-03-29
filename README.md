# Event Calendar

See [demo](https://vkurko.github.io/calendar/).

Full-sized JavaScript event calendar with resource view.

Inspired by [FullCalendar](https://fullcalendar.io/), implements similar options.

## Table of contents
- [Usage](#usage)
    - [Svelte component / ES6 module](#svelte-component--es6-module)
    - [Pre-built browser ready bundle](#pre-built-browser-ready-bundle)
- [Options](#options)
    - [buttonText](#buttontext)
    - [date](#date)
    - [dateClick](#dateclick)
    - [dayHeaderFormat](#dayheaderformat)
    - [displayEventEnd](#displayeventend)
    - [duration](#duration)
    - [editable](#editable)
    - [events](#events)
    - [eventBackgroundColor](#eventbackgroundcolor)
    - [eventClick](#eventclick)
    - [eventColor](#eventcolor)
    - [eventContent](#eventcontent)
    - [eventDidMount](#eventdidmount)
    - [eventDragStart](#eventdragstart)
    - [eventDragStop](#eventdragstop)
    - [eventDrop](#eventdrop)
    - [eventMouseEnter](#eventmouseenter)
    - [eventMouseLeave](#eventmouseleave)
    - [eventSources](#eventsources)
    - [eventStartEditable](#eventstarteditable)
    - [eventTimeFormat](#eventtimeformat)
    - [firstDay](#firstday)
    - [flexibleSlotTimeLimits](#flexibleslottimelimits)
    - [headerToolbar](#headertoolbar)
    - [height](#height)
    - [hiddenDays](#hiddendays)
    - [hideResourcesWithNoEvents](#hideresourceswithnoevents)
    - [highlightedDates](#highlighteddates)
    - [lazyFetching](#lazyfetching)
    - [listDayFormat](#listdayformat)
    - [listDaySideFormat](#listdaysideformat)
    - [loading](#loading)
    - [locale](#locale)
    - [monthMode](#monthmode)
    - [noEventsClick](#noeventsclick)
    - [noEventsContent](#noeventscontent)
    - [resources](#resources)
    - [scrollTime](#scrolltime)
    - [slotDuration](#slotduration)
    - [slotLabelFormat](#slotlabelformat)
    - [slotMaxTime](#slotmaxtime)
    - [slotMinTime](#slotmintime)
    - [theme](#theme)
    - [view](#view)
    - [viewDidMount](#viewdidmount)
    - [views](#views)
- [Event object](#event-object)
    - [Parsing event from a plain object](#parsing-event-from-a-plain-object)
- [Duration object](#duration-object)
    - [Parsing duration from input values](#parsing-duration-from-input-values)
- [Resource object](#resource-object)
    - [Parsing resource from a plain object](#parsing-resource-from-a-plain-object)
- [View object](#view-object)
- [Browser support](#browser-support)

## Usage
### Svelte component / ES6 module
The first step is to install the Event Calendar `core` package:
```bash
npm install --save-dev @event-calendar/core
```
Then install any additional plugins you plan to use:
```bash
npm install --save-dev @event-calendar/time-grid
```
You must use at least one plugin that provides a view. The following plugins are currently available:

* `@event-calendar/day-grid`
* `@event-calendar/list`
* `@event-calendar/resource-time-grid`
* `@event-calendar/time-grid`

Then, in your Svelte component, use the calendar something like this:
```html
<script>
    import Calendar from '@event-calendar/core';
    import TimeGrid from '@event-calendar/time-grid';

    let plugins = [TimeGrid];
    let options = {
        view: 'timeGridWeek',
        events: [
            // your list of events
        ]
    };
</script>

<Calendar {plugins} {options} />
```
Or in ES6 module:
```js
import Calendar from '@event-calendar/core';
import TimeGrid from '@event-calendar/time-grid';

let ec = new Calendar({
    target: document.getElementById('ec'),
    props: {
        plugins: [TimeGrid],
        options: {
            view: 'timeGridWeek',
            events: [
                // your list of events
            ]
        }
    }
});
```

### Pre-built browser ready bundle
Include the following lines of code in the `<head>` section of your page:
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@event-calendar/build/event-calendar.min.css">
<script src="https://cdn.jsdelivr.net/npm/@event-calendar/build/event-calendar.min.js"></script>
```
Then initialize the calendar with something like this:
```js
let ec = new EventCalendar(document.getElementById('ec'), {
    view: 'timeGridWeek',
    events: [
        // your list of events
    ]
});
```

## Options

### buttonText
- Type `object`
- Default `{today: 'today', dayGridMonth: 'month', listDay: 'list', listWeek: 'list', listMonth: 'list', listYear: 'list', resourceTimeGridDay: 'day', resourceTimeGridWeek: 'week', timeGridDay: 'day', timeGridWeek: 'week'}`

Text that is displayed in buttons of the header toolbar.

### date
- Type `Date` or `string`
- Default `new Date()`

Date that is currently displayed on the calendar.

This value can be either a JavaScript Date object, or an ISO8601 date string like `'2022-12-31'`.

### dateClick
- Type `function`
- Default `undefined`

Callback function that is triggered when the user clicks on a date or a time.

```js
function (dateClickInfo) {}
```
`dateClickInfo` is an object with the following properties:
<table>
<tr>
<td>

`date`
</td>
<td>JavaScript Date object for the clicked date and time</td>
</tr>
<tr>
<td>

`jsEvent`
</td>
<td>JavaScript native event object with low-level information such as click coordinates</td>
</tr>
<tr>
<td>

`view`
</td>
<td>

The current [View](#view-object) object
</td>
</tr>
<tr>
<td>

`resource`
</td>
<td>

If the current view is a resource view, the [Resource](#resource-object) object that owns this date
</td>
</tr>
</table>

### dayHeaderFormat
- Type `object` or `function`
- Default `{weekday: 'short', month: 'numeric', day: 'numeric'}`
> Views override the default value as follows:
> - dayGridMonth `{weekday: 'short'}`
> - timeGridDay `{weekday: 'long'}`

Defines the text that is displayed on the calendar’s column headings.

This value can be either an object with options for the native JavaScript [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat) object, or a callback function that returns formatted string:

```js
function (date) {
    // return formatted date string
}
```
<table>
<tr>
<td>

`date`
</td>
<td>JavaScript Date object that needs to be formatted</td>
</tr>
</table>

### displayEventEnd
- Type `boolean`
- Default `true`
> Views override the default value as follows:
> - dayGridMonth `false`

Determines whether to display an event’s end time.

### dragScroll
- Type `boolean`
- Default `true`

Determines whether the calendar should automatically scroll during the event drag-and-drop when the mouse crosses the edge.

### duration
- Type `string`, `integer` or `object`
- Default `{weeks: 1}`
> Views override the default value as follows:
> - dayGridMonth `{months: 1}`
> - listDay `{days: 1}`
> - listWeek `{weeks: 1}`
> - listMonth `{months: 1}`
> - listYear `{years: 1}`
> - resourceTimeGridDay `{days: 1}`
> - resourceTimeGridWeek `{weeks: 1}`
> - timeGridDay `{days: 1}`
> - timeGridWeek `{weeks: 1}`

Sets the duration of a view.

This should be a value that can be parsed into a [Duration](#duration-object) object.

### editable
- Type `boolean`
- Default `false`

Determines whether the events on the calendar can be dragged and resized (both at the same time).

Currently, only **dragging** is supported. See [eventStartEditable](#eventstarteditable).

### events
- Type `Array`
- Default `[]`

Array of plain objects that will be parsed into [Event](#event-object) objects and displayed on the calendar.

This option is not used if the `eventSources` option is provided.

### eventBackgroundColor
- Type `string`
- Default `undefined`

Sets the default background color for events on the calendar.

You can use any of the CSS color formats such `'#f00'`, `'#ff0000'`, `'rgb(255,0,0)'`, or `'red'`.

### eventClick
- Type `function`
- Default `undefined`

Callback function that is triggered when the user clicks an event.

```js
function (eventClickInfo) { }
```
`eventClickInfo` is an object with the following properties:
<table>
<tr>
<td>

`el`
</td>
<td>The HTML element for the event</td>
</tr>
<tr>
<td>

`event`
</td>
<td>

The associated [Event](#event-object) object
</td>
</tr>
<tr>
<td>

`jsEvent`
</td>
<td>JavaScript native event object with low-level information such as click coordinates</td>
</tr>
<tr>
<td>

`view`
</td>
<td>

The current [View](#view-object) object
</td>
</tr>
</table>

### eventColor
- Type `string`
- Default `undefined`

This is currently an alias for the `eventBackgroundColor`.

### eventContent
- Type `string`, `object`or `function`
- Default `undefined`

Defines the content that is rendered inside an event’s element.

This value can be either a string containing HTML `'<p>...</p>'`, an object containing the HTML string `{html: '<p>...</p>'}`, an object containing an array of DOM nodes `{domNodes: [node1, node2, ...]}` or a function that returns any of the above formats:

```js
function (eventInfo) {
    // return string or object
}
```
`eventInfo` is an object with the following properties:
<table>
<tr>
<td>

`event`
</td>
<td>

The associated [Event](#event-object) object
</td>
</tr>
<tr>
<td>

`timeText`
</td>
<td>Formatted time of the event</td>
</tr>
<tr>
<td>

`view`
</td>
<td>

The current [View](#view-object) object
</td>
</tr>
</table>

### eventDidMount
- Type `function`
- Default `undefined`

Callback function that is triggered right after the element has been added to the DOM. If the event data changes, this is not called again.

```js
function (mountInfo) { }
```
`mountInfo` is an object with the following properties:
<table>
<tr>
<td>

`el`
</td>
<td>The HTML element for the event</td>
</tr>
<tr>
<td>

`event`
</td>
<td>

The associated [Event](#event-object) object
</td>
</tr>
<tr>
<td>

`timeText`
</td>
<td>Formatted time of the event</td>
</tr>
<tr>
<td>

`view`
</td>
<td>

The current [View](#view-object) object
</td>
</tr>
</table>

### eventDragStart
- Type `function`
- Default `undefined`

Callback function that is triggered when the event dragging begins.

```js
function (info) { }
```
`info` is an object with the following properties:
<table>
<tr>
<td>

`event`
</td>
<td>

The associated [Event](#event-object) object
</td>
</tr>
<tr>
<td>

`jsEvent`
</td>
<td>JavaScript native event object with low-level information such as click coordinates</td>
</tr>
<tr>
<td>

`view`
</td>
<td>

The current [View](#view-object) object
</td>
</tr>
</table>

### eventDragStop
- Type `function`
- Default `undefined`

Callback function that is triggered when the event dragging stops.

It is triggered before the event’s information has been modified (if moved to a new date/time) and before the [eventDrop](#eventdrop) callback is triggered.

```js
function (info) { }
```
`info` is an object with the following properties:
<table>
<tr>
<td>

`event`
</td>
<td>

The associated [Event](#event-object) object
</td>
</tr>
<tr>
<td>

`jsEvent`
</td>
<td>JavaScript native event object with low-level information such as click coordinates</td>
</tr>
<tr>
<td>

`view`
</td>
<td>

The current [View](#view-object) object
</td>
</tr>
</table>

### eventDrop
- Type `function`
- Default `undefined`

Callback function that is triggered when dragging stops, and the event has moved to a different day/time.

It is triggered after the event’s information has been modified and after the [eventDragStop](#eventdrop) callback has been triggered.

```js
function (info) { }
```
`info` is an object with the following properties:
<table>
<tr>
<td>

`event`
</td>
<td>

The associated [Event](#event-object) object
</td>
</tr>
<tr>
<td>

`oldEvent`
</td>
<td>

An [Event](#event-object) object that holds information about the event before the drop
</td>
</tr>
<tr>
<td>

`oldResource`
</td>
<td>

If the resource has changed, this is the [Resource](#resource-object) object the event came from. If the resource has not changed, this will be undefined
</td>
</tr>
<tr>
<td>

`newResource`
</td>
<td>

If the resource has changed, this is the [Resource](#resource-object) object the event went to. If the resource has not changed, this will be undefined
</td>
</tr>
<tr>
<td>

`delta`
</td>
<td>

A [Duration](#duration-object) object that represents the amount of time the event was moved by
</td>
</tr>
<tr>
<td>

`revert`
</td>
<td>

A function that, if called, reverts the event’s start/end date to the values before the drag
</td>
</tr>
<tr>
<td>

`jsEvent`
</td>
<td>JavaScript native event object with low-level information such as click coordinates</td>
</tr>
<tr>
<td>

`view`
</td>
<td>

The current [View](#view-object) object
</td>
</tr>
</table>

### eventMouseEnter
- Type `function`
- Default `undefined`

Callback function that is triggered when the user hovers over an event with the cursor (mouse pointer).

```js
function (mouseEnterInfo) { }
```
`mouseEnterInfo` is an object with the following properties:
<table>
<tr>
<td>

`el`
</td>
<td>The HTML element for the event</td>
</tr>
<tr>
<td>

`event`
</td>
<td>

The associated [Event](#event-object) object
</td>
</tr>
<tr>
<td>

`jsEvent`
</td>
<td>JavaScript native event object with low-level information such as click coordinates</td>
</tr>
<tr>
<td>

`view`
</td>
<td>

The current [View](#view-object) object
</td>
</tr>
</table>

### eventMouseLeave
- Type `function`
- Default `undefined`

Callback function that is triggered when the cursor (mouse pointer) is moved out of an event.

```js
function (mouseLeaveInfo) { }
```
`mouseLeaveInfo` is an object with the following properties:
<table>
<tr>
<td>

`el`
</td>
<td>The HTML element for the event</td>
</tr>
<tr>
<td>

`event`
</td>
<td>

The associated [Event](#event-object) object
</td>
</tr>
<tr>
<td>

`jsEvent`
</td>
<td>JavaScript native event object with low-level information such as click coordinates</td>
</tr>
<tr>
<td>

`view`
</td>
<td>

The current [View](#view-object) object
</td>
</tr>
</table>

### eventSources
- Type `EventSource[]`
- Default `[]`

Array of EventSource objects that will provide the Event Calendar with data about events.

This option is used instead of the `events` option.

`EventSource` should be an object with the following properties:
<table>
<tr>
<td>

`url`
</td>
<td>

A URL that the calendar will fetch [Event](#event-object) objects from
</td>
</tr>
<tr>
<td>

`method`
</td>
<td>

HTTP request method. Default `'GET'`
</td>
</tr>
<tr>
<td>

`extraParams`
</td>
<td>

Other GET/POST data you want to send to the server. Can be a plain object or a function that returns an object. Default `{}`
</td>
</tr>
</table>

### eventStartEditable
- Type `boolean`
- Default `true`

Determines whether the events on the calendar can be dragged.

### eventTimeFormat
- Type `object` or `function`
- Default `{hour: 'numeric', minute: '2-digit'}`

Defines the time-text that is displayed on each event.

This value can be either an object with options for the native JavaScript [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat) object, or a callback function that returns formatted string:

```js
function (time) {
    // return formatted time string
}
```
<table>
<tr>
<td>

`time`
</td>
<td>JavaScript Date object that needs to be formatted</td>
</tr>
</table>

### firstDay
- Type `integer`
- Default `0`

The day that each week begins at, where Sunday is `0`, Monday is `1`, etc. Saturday is `6`.

### flexibleSlotTimeLimits
- Type `boolean`
- Default `false`

Determines whether [slotMinTime](#slotmintime) and [slotMaxTime](#slotmaxtime) should automatically expand when an event goes out of bounds.

### headerToolbar
- Type `object`
- Default `{start: 'title', center: '', end: 'today prev,next'}`

Defines the buttons and title at the top of the calendar.

An object can be supplied with properties `start`,`center`,`end`. These properties contain strings with comma/space separated values. Values separated by a comma will be displayed adjacently. Values separated by a space will be displayed with a small gap in between. Strings can contain any of the following values:
<table>
<tr>
<td>

`title`
</td>
<td>A text containing the current month/week/day</td>
</tr>
<tr>
<td>

`prev`
</td>
<td>A button for moving the calendar back one month/week/day</td>
</tr>
<tr>
<td>

`next`
</td>
<td>A button for moving the calendar forward one month/week/day</td>
</tr>
<tr>
<td>

`today`
</td>
<td>A button for moving the calendar to the current month/week/day</td>
</tr>
<tr>
<td>

_a view name like_ `dayGridMonth`
</td>
<td>A button that will switch the calendar to a specific view</td>
</tr>
</table>

### height
- Type `string`
- Default `'auto'`

Defines the height of the entire calendar.

This should be a valid CSS value like `'100%'` or `'600px'`.

### hiddenDays
- Type `Array`
- Default `[]`

Exclude certain days-of-the-week from being displayed, where Sunday is `0`, Monday is `1`, etc. Saturday is `6`.

### hideResourcesWithNoEvents
- Type `boolean`
- Default `false`

Determines whether resources with no events for the current range should be hidden in the resource view.

### highlightedDates
- Type `Array`
- Default `[]`

Array of dates that need to be highlighted in the calendar.

Each date can be either an ISO8601 date string like `'2022-12-31'`, or a JavaScript Date object.

### lazyFetching
- Type `boolean`
- Default `true`

Determines when event fetching should occur.

When set to `true` (the default), the calendar will only fetch events when it absolutely needs to, minimizing HTTP requests. For example, say your calendar starts out in month view, in February. The Event Calendar will fetch events for the entire month of February and store them in its internal storage. Then, say the user switches to week view and begins browsing the weeks in February. The calendar will avoid fetching events because it already has this information stored.

When set to `false`, the calendar will fetch events any time the view is switched, or any time the current date changes (for example, as a result of the user clicking prev/next).

### listDayFormat
- Type `object` or `function`
- Default `{weekday: 'long'}`

Defines the text on the left side of the day headings in list view.

This value can be either an object with options for the native JavaScript [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat) object, or a callback function that returns formatted string:

```js
function (date) {
    // return formatted date string
}
```
<table>
<tr>
<td>

`date`
</td>
<td>JavaScript Date object that needs to be formatted</td>
</tr>
</table>

### listDaySideFormat
- Type `object` or `function`
- Default `{year: 'numeric', month: 'long', day: 'numeric'}`

Defines the text on the right side of the day headings in list view.

This value can be either an object with options for the native JavaScript [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat) object, or a callback function that returns formatted string:

```js
function (date) {
    // return formatted date string
}
```
<table>
<tr>
<td>

`date`
</td>
<td>JavaScript Date object that needs to be formatted</td>
</tr>
</table>

### loading
- Type `function`
- Default `undefined`

Callback function that is triggered when event fetching starts/stops.

```js
function (isLoading) { }
```
<table>
<tr>
<td>

`isLoading`
</td>
<td>

`true` when the calendar begins fetching events, `false` when it’s done.
</td>
</tr>
</table>

### locale
- Type `string`
- Default `undefined`

Defines the `locales` parameter for the native JavaScript [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat) object that the Event Calendar uses to format date and time strings in options such as [dayHeaderFormat](#dayheaderformat), [eventTimeFormat](#eventtimeformat), etc.

### monthMode
- Type `boolean`
- Default `false`
> Views override the default value as follows:
> - dayGridMonth `true`

Tells the calendar that visible dates should start from the [firstDay](#firstday) of the week, even if it will display days outside the current range (this is a common case for a month calendar when you can see days from adjacent months).

### noEventsClick
- Type `function`
- Default `undefined`

Callback function that is triggered when the user clicks _No events_ area in list view.

```js
function (clickInfo) { }
```
`clickInfo` is an object with the following properties:
<table>
<tr>
<td>

`jsEvent`
</td>
<td>JavaScript native event object with low-level information such as click coordinates</td>
</tr>
<tr>
<td>

`view`
</td>
<td>

The current [View](#view-object) object
</td>
</tr>
</table>

### noEventsContent
- Type `string`, `object`or `function`
- Default `'No events'`

Defines the text that is displayed in list view when there are no events to display.

This value can be either a string containing HTML `'<p>...</p>'`, an object containing the HTML string `{html: '<p>...</p>'}`, an object containing an array of DOM nodes `{domNodes: [node1, node2, ...]}` or a function that returns any of the above formats:

```js
function () {
    // return string or object
}
```

### resources
- Type `Array`
- Default `[]`

Array of plain objects that will be parsed into [Resource](#resource-object) objects for displaying in the resource view.

### scrollTime
- Type `string`, `integer` or `object`
- Default `'06:00:00'`

Determines how far forward the scroll pane is initially scrolled.

This should be a value that can be parsed into a [Duration](#duration-object) object.

### slotDuration
- Type `string`, `integer` or `object`
- Default `'00:30:00'`

Defines the frequency for displaying time slots.

This should be a value that can be parsed into a [Duration](#duration-object) object.

### slotLabelFormat
- Type `object` or `function`
- Default `{hour: 'numeric', minute: '2-digit'}`

Defines the text that will be displayed within a time slot.

This value can be either an object with options for the native JavaScript [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat) object, or a callback function that returns formatted string:

```js
function (time) {
    // return formatted time string
}
```
<table>
<tr>
<td>

`time`
</td>
<td>JavaScript Date object that needs to be formatted</td>
</tr>
</table>

### slotMaxTime
- Type `string`, `integer` or `object`
- Default `'24:00:00'`

Defines the last time slot that will be displayed for each day.

This should be a value that can be parsed into a [Duration](#duration-object) object.

### slotMinTime
- Type `string`, `integer` or `object`
- Default `'00:00:00'`

Defines the first time slot that will be displayed for each day.

This should be a value that can be parsed into a [Duration](#duration-object) object.

### theme
- Type `object` or `function`
- Default `{calendar: 'ec', header: 'ec-header', withScroll: 'ec-with-scroll', hiddenScroll: 'ec-hidden-scroll', body: 'ec-body', week: 'ec-week', compact: 'ec-compact', toolbar: 'ec-toolbar', sidebar: 'ec-sidebar', content: 'ec-content', lines: 'ec-lines', line: 'ec-line', days: 'ec-days', day: 'ec-day', dayHead: 'ec-day-head', today: 'ec-today', otherMonth: 'ec-other-month', highlight: 'ec-highlight', events: 'ec-events', event: 'ec-event', eventTime: 'ec-event-time', eventTitle: 'ec-event-title', bgEvents: 'ec-bg-events', bgEvent: 'ec-bg-event', hiddenTimes: 'ec-hidden-times', time: 'ec-time', button: 'ec-button', buttonGroup: 'ec-button-group', icon: 'ec-icon', active: 'ec-active', title: 'ec-title', month: 'ec-month', daySide: 'ec-day-side', eventTag: 'ec-event-tag', list: 'ec-list', noEvents: 'ec-no-events', resource: 'ec-resource', resourceTitle: 'ec-resource-title'}`

Defines the CSS classes that the Event Calendar uses to generate HTML markup.

This value can be either a plain object with all necessary properties, or a callback function that receives default theme object and should return an actual one:

```js
function (theme) {
    // return actual theme object
}
```
<table>
<tr>
<td>

`theme`
</td>
<td>An object with default CSS classes</td>
</tr>
</table>

### titleFormat
- Type `object` or `function`
- Default `{year: 'numeric', month: 'short', day: 'numeric'}`
> Views override the default value as follows:
> - dayGridMonth `{year: 'numeric', month: 'long'}`
> - timeGridDay `{year: 'numeric', month: 'long', day: 'numeric'}`

Defines the text that is displayed in the header toolbar’s title.

This value can be either an object with options for the native JavaScript [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat) object, or a callback function that returns formatted string:

```js
function (date) {
    // return formatted date string
}
```
<table>
<tr>
<td>

`date`
</td>
<td>JavaScript Date object that needs to be formatted</td>
</tr>
</table>

### view
- Type `string`
- Default `'resourceTimeGridWeek'`

The view that is displayed in the calendar. Can be `'dayGridMonth'`, `'listDay'`, `'listWeek'`, `'listMonth'`, `'listYear'`, `'resourceTimeGridDay'`, `'resourceTimeGridWeek'`, `'timeGridDay'` or `'timeGridWeek'`.

### viewDidMount
- Type `function`
- Default `undefined`

Callback function that is triggered right after the view has been added to the DOM.

```js
function (mountInfo) { }
```
`mountInfo` is an object with the following properties:
<table>
<tr>
<td>

`view`
</td>
<td>

The mounted [View](#view-object) object
</td>
</tr>
</table>

### views
- Type `object`
- Default `{}`

You can specify options that apply only to specific views. To do so provide separate options objects within the `views` option, keyed by the name of the view.

## Event object
This is a JavaScript object that the Event Calendar uses to store information about a calendar event.

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
<td>The text appearing on the event</td>
</tr>
<tr>
<td>

`display`
</td>
<td>

The rendering type of the event. Can be `'auto'` or `'background'`
</td>
</tr>
<tr>
<td>

`backgroundColor`
</td>
<td>

The [eventBackgroundColor](#eventbackgroundcolor) override for this specific event
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

### Parsing event from a plain object
When Event Calendar receives an array of plain event’s objects either from the `events` option or as a result of an HTTP request to a URL of an event source, it parses the input objects into proper Event objects.

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

`resourceId`
</td>
<td>

`string` or `integer` An ID of a resource that the event is associated with. This field is not used if `resourceIds` is provided. Default `undefined`
</td>
</tr>
<tr>
<td>

`resourceIds`
</td>
<td>

`Array` An array of resource IDs that the event is associated with. This field is used instead of `resourceId`. Default `[]`
</td>
</tr>
<tr>
<td>

`start`
</td>
<td>

`string` or `Date` This should be either an ISO8601 datetime string like `'2022-12-31 09:00:00'`, or a JavaScript Date object holding the event’s start time
</td>
</tr>
<tr>
<td>

`end`
</td>
<td>

`string` or `Date` This should be either an ISO8601 datetime string like `'2022-12-31 13:00:00'`, or a JavaScript Date object holding the event’s end time
</td>
</tr>
<tr>
<td>

`title`
</td>
<td>

`string` The text that will appear on the event. Default `''`
</td>
</tr>
<tr>
<td>

`display`
</td>
<td>

`string` The rendering type of the event. Can be `'auto'` or `'background'`. Default `'auto'`

In addition, in your callback functions, you may get the `'ghost'` and `'preview'` for this property, which are internal values and are used to display events during drag-and-drop operations
</td>
</tr>
<tr>
<td>

`backgroundColor`
</td>
<td>

`string` Sets the event’s background color just like the calendar-wide [eventBackgroundColor](#eventbackgroundcolor) option. Default `undefined`
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

`extendedProps`
</td>
<td>

`object` A plain object with any miscellaneous properties. It will be directly transferred to the `extendedProps` property of the Event object. Default `{}`
</td>
</tr>
</table>

## Duration object
This is a JavaScript object that the Event Calendar uses to store information about a period of time, like _30 minutes_ or _1 day and 6 hours_.

Here are all properties that exist in Duration object:
<table>
<tr>
<td>

`years`
</td>
<td>The number of years in duration</td>
</tr>
<tr>
<td>

`months`
</td>
<td>The number of months in duration</td>
</tr>
<tr>
<td>

`days`
</td>
<td>The number of days in duration</td>
</tr>
<tr>
<td>

`seconds`
</td>
<td>The number of seconds in duration. If you want hours and minutes, you need to do division on this property</td>
</tr>
<tr>
<td>

`inWeeks`
</td>
<td>Determines whether the duration represents a time period in weeks. This value is set during parsing the input data</td>
</tr>
</table>

### Parsing duration from input values
When Event Calendar receives a value for options like `duration`, `scrollTime`, `slotDuration` and others, it parses it into a proper Duration object.

The admissible input value can be specified in one of three formats:
- an object with any of the following keys: `year`, `years`, `month`, `months`, `day`, `days`, `minute`, `minutes`, `second`, `seconds`
- a string in the format `hh:mm:ss` or `hh:mm`. For example, `'05:00'` specifies 5 hours
- an integer specifying the total number of seconds

## Resource object
This is a JavaScript object that the Event Calendar uses to store information about a resource. Calendar events can be associated with resources and displayed separately using the resource view.

Here are all properties that exist in Resource object:
<table>
<tr>
<td>

`id`
</td>
<td>The unique string identifier for the resource</td>
</tr>
<tr>
<td>

`title`
</td>
<td>The title of the resource</td>
</tr>
</table>

### Parsing resource from a plain object
When Event Calendar receives an array of plain resource’s objects for the `resources` option, it parses the input objects into proper Resource objects.

Here are all admissible fields for the resource’s input object:
<table>
<tr>
<td>

`id`
</td>
<td>

`integer` or `string` Uniquely identifies the resource. [Event](#event-object) objects with a corresponding `resourceIds` field will be linked to this resource. Will be coerced into a `string`
</td>
</tr>
<tr>
<td>

`title`
</td>
<td>

`string` Text that will be displayed on the resource when it is rendered. Default `''`
</td>
</tr>
</table>

## View object
A View object contains information about a calendar view, such as title and date range.

Here are all properties that exist in View object:
<table>
<tr>
<td>

`type`
</td>
<td>Name of the view</td>
</tr>
<tr>
<td>

`title`
</td>
<td>Title text that is displayed at the top of the header toolbar</td>
</tr>
<tr>
<td>

`currentStart`
</td>
<td>JavaScript Date that is the start of the interval the view is trying to represent. For example, in month view, this will be the first day of the month. This value disregards hidden days</td>
</tr>
<tr>
<td>

`currentEnd`
</td>
<td>JavaScript Date that is the end of the interval the view is trying to represent. Note: This value is exclusive. For example, in month view, this will be the day after the last day of the month. This value disregards hidden days</td>
</tr>
<tr>
<td>

`activeStart`
</td>
<td>JavaScript Date that is the first visible day. In month view, this value is often before the 1st day of the month, because most months do not begin on the first day-of-week</td>
</tr>
<tr>
<td>

`activeEnd`
</td>
<td>JavaScript Date that is the last visible day. Note: This value is exclusive</td>
</tr>
</table>

## Browser support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Opera (latest)
- Edge (latest)
- Internet Explorer 11