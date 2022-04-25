# Event Calendar [![](https://data.jsdelivr.com/v1/package/npm/@event-calendar/build/badge)](https://www.jsdelivr.com/package/npm/@event-calendar/build) [![Donate](https://img.shields.io/badge/Donate_$10-PayPal-green.svg)](https://www.paypal.me/vkurko/10usd) [![Donate](https://img.shields.io/badge/Donate_$1-PayPal-green.svg)](https://www.paypal.me/vkurko/1usd)

See [demo](https://vkurko.github.io/calendar/).

Full-sized drag & drop JavaScript event calendar with resource view:

* Lightweight (48kb [br](https://en.wikipedia.org/wiki/Brotli) compressed `modern` version)
* Zero-dependency (pre-built bundle)
* Used by [Bookly](https://wordpress.org/plugins/bookly-responsive-appointment-booking-tool/)

Inspired by [FullCalendar](https://fullcalendar.io/), implements similar options.

## Table of contents
- [Usage](#usage)
  - [Svelte component / ES6 module](#svelte-component--es6-module)
  - [Pre-built browser ready bundle](#pre-built-browser-ready-bundle)
  - [Modifying options after initialization](#modifying-options-after-initialization)
- [Options](#options)
  <table>
  <tr><td>

  - [buttonText](#buttontext)
  - [date](#date)
  - [dateClick](#dateclick)
  - [datesAboveResources](#datesaboveresources)
  - [datesSet](#datesset)
  - [dayHeaderFormat](#dayheaderformat)
  - [dayMaxEvents](#daymaxevents)
  - [dayPopoverFormat](#daypopoverformat)
  - [displayEventEnd](#displayeventend)
  - [dragScroll](#dragscroll)
  - [duration](#duration)
  - [editable](#editable)
  - [events](#events)
  - [eventBackgroundColor](#eventbackgroundcolor)
  - [eventClick](#eventclick)
  - [eventColor](#eventcolor)
  - [eventContent](#eventcontent)
  - [eventDidMount](#eventdidmount)
  - [eventDragMinDistance](#eventdragmindistance)
  - [eventDragStart](#eventdragstart)
  </td><td>

  - [eventDragStop](#eventdragstop)
  - [eventDrop](#eventdrop)
  - [eventDurationEditable](#eventdurationeditable)
  - [eventMouseEnter](#eventmouseenter)
  - [eventMouseLeave](#eventmouseleave)
  - [eventResize](#eventresize)
  - [eventResizeStart](#eventresizestart)
  - [eventResizeStop](#eventresizestop)
  - [eventSources](#eventsources)
  - [eventStartEditable](#eventstarteditable)
  - [eventTimeFormat](#eventtimeformat)
  - [filterResourcesWithEvents](#filterresourceswithevents)
  - [firstDay](#firstday)
  - [flexibleSlotTimeLimits](#flexibleslottimelimits)
  - [headerToolbar](#headertoolbar)
  - [height](#height)
  - [hiddenDays](#hiddendays)
  - [highlightedDates](#highlighteddates)
  - [lazyFetching](#lazyfetching)
  - [listDayFormat](#listdayformat)
  </td><td>
  
  - [listDaySideFormat](#listdaysideformat)
  - [loading](#loading)
  - [locale](#locale)
  - [monthMode](#monthmode)
  - [moreLinkContent](#morelinkcontent)
  - [noEventsClick](#noeventsclick)
  - [noEventsContent](#noeventscontent)
  - [nowIndicator](#nowindicator)
  - [pointer](#pointer)
  - [resources](#resources)
  - [scrollTime](#scrolltime)
  - [slotDuration](#slotduration)
  - [slotHeight](#slotheight)
  - [slotLabelFormat](#slotlabelformat)
  - [slotMaxTime](#slotmaxtime)
  - [slotMinTime](#slotmintime)
  - [theme](#theme)
  - [view](#view)
  - [viewDidMount](#viewdidmount)
  - [views](#views)
  </td></tr>
  </table>
- [Methods](#methods)
  <table>
  <tr><td>

  - [getOption](#getoption-name-)
  - [setOption](#setoption-name-value-)
  </td><td>

  - [getEvents](#getevents)
  - [getEventById](#geteventbyid-id-)
  - [removeEventById](#removeeventbyid-id-)
  - [addEvent](#addevent-event-)
  - [updateEvent](#updateevent-event-)
  - [refetchEvents](#refetchevents)
  </td><td>

  - [getView](#getview)
  </td></tr>
  </table>
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
* `@event-calendar/interaction` (doesn't provide a view)

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
> If you don't need IE11 support, you can use the `modern` version of the bundle instead: `event-calendar-modern.min.css` and `event-calendar-modern.min.js`. The lack of IE11 support makes the bundle ~1.5 times smaller.

Then initialize the calendar with something like this:
```js
let ec = new EventCalendar(document.getElementById('ec'), {
    view: 'timeGridWeek',
    events: [
        // your list of events
    ]
});
```

### Modifying options after initialization
You can modify the calendar options after initialization using the [setOption](#setoption-name-value-) method.
```js
ec.setOption('slotDuration', '01:00');
```
In Svelte, you can simply update the original `options` object.
```html
<script>
    import Calendar from '@event-calendar/core';
    import TimeGrid from '@event-calendar/time-grid';

    let plugins = [TimeGrid];
    let options = {
        view: 'timeGridWeek'
    };

    function updateOptions() {
        options.slotDuration = '01:00';
    }
</script>

<button on:click={updateOptions}>Change slot duration</button>
<Calendar {plugins} {options} />
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

`dateStr`
</td>
<td>ISO8601 string representation of the date</td>
</tr>
<tr>
<td>

`dayEl`
</td>
<td>HTML element that represents the whole-day that was clicked on</td>
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

### datesAboveResources
- Type `boolean`
- Default `false`

Determines whether the resource view should render the date headings above the resource headings.

### datesSet
- Type `function`
- Default `undefined`

Callback function that is triggered when the date range of the calendar was originally set or changed by clicking the previous/next buttons, changing the view, manipulating the current date via the API, etc.

```js
function (info) {}
```
`info` is an object with the following properties:
<table>
<tr>
<td>

`start`
</td>
<td>JavaScript Date object for the beginning of the range the calendar needs events for</td>
</tr>
<tr>
<td>

`end`
</td>
<td>JavaScript Date object for the end of the range the calendar needs events for. Note: This value is exclusive</td>
</tr>
<tr>
<td>

`startStr`
</td>
<td>ISO8601 string representation of the start date</td>
</tr>
<tr>
<td>

`endStr`
</td>
<td>ISO8601 string representation of the end date</td>
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

### dayMaxEvents
- Type `boolean`
- Default `false`

Determines the maximum number of stacked event levels for a given day in the `dayGrid` view.

If there are too many events, a link like `+2 more` is displayed.

Currently, only the value `true` is supported, which limits the number of events to the height of the day cell.

### dayPopoverFormat
- Type `object` or `function`
- Default `{month: 'long', day: 'numeric', year: 'numeric'}`

Defines the date format of title of the popover created by the [dayMaxEvents](#daymaxevents) option.

This value can be either an object with options for the native JavaScript [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat) object, or a callback function that returns formatted string:

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

If you don't need both, use the more specific [eventStartEditable](#eventstarteditable) and [eventDurationEditable](#eventdurationeditable) instead.

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

### eventDragMinDistance
- Type `integer`
- Default `5`

Defines how many pixels the user’s mouse must move before the event dragging begins.

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

It is triggered after the event’s information has been modified and after the [eventDragStop](#eventdragstop) callback has been triggered.

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

### eventDurationEditable
- Type `boolean`
- Default `true`

Determines whether calendar events can be resized.

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

### eventResize
- Type `function`
- Default `undefined`

Callback function that is triggered when resizing stops, and the duration of the event has changed.

It is triggered after the event’s information has been modified and after the [eventResizeStop](#eventresizestop) callback has been triggered.

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

An [Event](#event-object) object that holds information about the event before the resize
</td>
</tr>
<tr>
<td>

`endDelta`
</td>
<td>

A [Duration](#duration-object) object that represents the amount of time the event’s end date was moved by
</td>
</tr>
<tr>
<td>

`revert`
</td>
<td>

A function that, if called, reverts the event’s end date to the values before the resize
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

### eventResizeStart
- Type `function`
- Default `undefined`

Callback function that is triggered when the event resizing begins.

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

### eventResizeStop
- Type `function`
- Default `undefined`

Callback function that is triggered when the event resizing stops.

It is triggered before the event’s information has been modified (if duration is changed) and before the [eventResize](#eventresize) callback is triggered.

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

### eventSources
- Type `EventSource[]`
- Default `[]`

Array of EventSource objects that will provide the Event Calendar with data about events.

This option is used instead of the `events` option.

`EventSource` should be an object with one of the following sets of properties:

#### 1. Fetch events from a URL
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

#### 2. Execute custom function
<table>
<tr>
<td>

`events`
</td>
<td>

A custom function that is executed whenever the Event Calendar needs new event data.

```js
function(fetchInfo, successCallback, failureCallback) { }
```
`fetchInfo` is an object with the following properties:
<table>
<tr>
<td>

`start`
</td>
<td>JavaScript Date object for the beginning of the range the calendar needs events for</td>
</tr>
<tr>
<td>

`end`
</td>
<td>JavaScript Date object for the end of the range the calendar needs events for. Note: This value is exclusive</td>
</tr>
<tr>
<td>

`startStr`
</td>
<td>ISO8601 string representation of the start date</td>
</tr>
<tr>
<td>

`endStr`
</td>
<td>ISO8601 string representation of the end date</td>
</tr>
</table>

The `successCallback` function must be called by the custom function with an array of parsable [Event](#event-object) objects.

If there is any failure (e.g., if an AJAX request fails), then call the `failureCallback` instead. It accepts an argument with information about the failure.

Instead of calling `successCallback` and `failureCallback`, you may return the resulting array of events or return a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) (or [thenable](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/resolve)) object instead.
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

### filterResourcesWithEvents
- Type `boolean`
- Default `false`

Determines whether resources with no events for the current range should be hidden in the resource view.

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

### moreLinkContent
- Type `string`, `object`or `function`
- Default `undefined`

Defines the text that is displayed instead of the default `+2 more` created by the [dayMaxEvents](#daymaxevents) option.

This value can be either a string containing HTML `'<p>...</p>'`, an object containing the HTML string `{html: '<p>...</p>'}`, an object containing an array of DOM nodes `{domNodes: [node1, node2, ...]}` or a function that returns any of the above formats:

```js
function (arg) {
  // return string or object
}
```
`arg` is an object with the following properties:
<table>
<tr>
<td>

`num`
</td>
<td>The number of hidden events</td>
</tr>
<tr>
<td>

`text`
</td>
<td>

The default text like `+2 more`
</td>
</tr>
</table>

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

### nowIndicator
- Type `boolean`
- Default `false`

Enables a marker indicating the current time in `timeGrid`/`resourceTimeGrid` views.

### pointer
- Type `boolean`
- Default `false`

Enables mouse cursor pointer in `timeGrid`/`resourceTimeGrid` views.

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

### slotHeight
- Type `integer`
- Default `24`

Defines the time slot height in pixels. When changing the setting, you must additionally override the following CSS styles:

```css
.ec-time, .ec-line {
  height: 24px;  /* override this value */
}
```

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
- Default `{active: 'ec-active', bgEvent: 'ec-bg-event', bgEvents: 'ec-bg-events', body: 'ec-body', button: 'ec-button', buttonGroup: 'ec-button-group', calendar: 'ec', compact: 'ec-compact', content: 'ec-content', day: 'ec-day', dayHead: 'ec-day-head', days: 'ec-days', event: 'ec-event', eventBody: 'ec-event-body', eventTime: 'ec-event-time', eventTitle: 'ec-event-title', events: 'ec-events', extra: 'ec-extra', handle: 'ec-handle', header: 'ec-header', hiddenScroll: 'ec-hidden-scroll', hiddenTimes: 'ec-hidden-times', highlight: 'ec-highlight', icon: 'ec-icon', line: 'ec-line', lines: 'ec-lines', nowIndicator: 'ec-now-indicator', otherMonth: 'ec-other-month', sidebar: 'ec-sidebar', today: 'ec-today', time: 'ec-time', title: 'ec-title', toolbar: 'ec-toolbar', week: 'ec-week', withScroll: 'ec-with-scroll', uniform: 'ec-uniform', dayFoot: 'ec-day-foot', month: 'ec-month', popup: 'ec-popup', daySide: 'ec-day-side', eventTag: 'ec-event-tag', list: 'ec-list', noEvents: 'ec-no-events', resource: 'ec-resource', resourceTitle: 'ec-resource-title', draggable: 'ec-draggable', ghost: 'ec-ghost', preview: 'ec-preview', pointer: 'ec-pointer', resizer: 'ec-resizer', dragging: 'ec-dragging', resizingY: 'ec-resizing-y', resizingX: 'ec-resizing-x'}`

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

## Methods
Methods allow you to manipulate the Event Calendar after initialization. They are accessible from the calendar instance.

In Svelte, methods are available from a component instance:
```html
<script>
    import Calendar from '@event-calendar/core';
    import TimeGrid from '@event-calendar/time-grid';

    let ec;
    let plugins = [TimeGrid];
    let options = {
        view: 'timeGridWeek',
        eventSources: [{events: function() {
            console.log('fetching...');
            return [];
        }}]
    };

    function invokeMethod() {
        ec.refetchEvents();
    }
</script>

<button on:click={invokeMethod}>Refetch events</button>
<Calendar bind:this={ec} {plugins} {options} />
```

### getOption( name )
- Parameters
  - `name` `string` The option name
- Return value `mixed` or `undefined`

This method allows you to get the current value of any calendar option.

```js
// E.g. Get current date
let date = ec.getOption('date');
```

### setOption( name, value )
- Parameters
  - `name` `string` The option name
  - `value` `mixed` The new option value
- Return value `EventCalendar` The calendar instance for chaining

This method allows you to set new value to any calendar option.

```js
// E.g. Change the current date
ec.setOption('date', new Date());
```
### getEvents()
- Return value `Event[]` Array of [Event](#event-object) objects

Returns an array of events that the calendar has in memory.

### getEventById( id )
- Parameters
  - `id` `string|integer` The ID of the event
- Return value [Event](#event-object) object or `null`

Returns a single event with the matching `id`.

### removeEventById( id )
- Parameters
  - `id` `string|integer` The ID of the event
- Return value `EventCalendar` The calendar instance for chaining

Removes a single event with the matching `id`.

### addEvent( event )
- Parameters
  - `event` `object` A plain object that will be parsed into an [Event](#event-object) object
- Return value [Event](#event-object) object or `null`

Adds a new event to the calendar.

### updateEvent( event )
- Parameters
  - `event` `object` A plain object or [Event](#event-object) object
- Return value `EventCalendar` The calendar instance for chaining

Updates a single event with the matching `event`.`id`.

### refetchEvents()
- Return value `EventCalendar` The calendar instance for chaining

Refetches events from all sources.

### getView()
- Return value `View`

Returns the [View](#view-object) object for the current view.

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

`editable`
</td>
<td>

Boolean (`true` or `false`) or `undefined`. The value overriding the [editable](#editable) setting for this specific event
</td>
</tr>
<tr>
<td>

`startEditable`
</td>
<td>

Boolean (`true` or `false`) or `undefined`. The value overriding the [eventStartEditable](#eventstarteditable) setting for this specific event
</td>
</tr>
<tr>
<td>

`durationEditable`
</td>
<td>

Boolean (`true` or `false`) or `undefined`. The value overriding the [eventDurationEditable](#eventdurationeditable) setting for this specific event
</td>
</tr>
<tr>
<td>

`display`
</td>
<td>

The rendering type of the event. Can be `'auto'` or `'background'`

In addition, in your callback functions, you may get the `'ghost'`, `'preview'` and `'pointer'` for this property, which are internal values and are used, for example, to display events during drag-and-drop operations
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

`editable`
</td>
<td>

`boolean` Overrides the master [editable](#editable) option for this single event. Default `undefined`
</td>
</tr>
<tr>
<td>

`startEditable`
</td>
<td>

`boolean` Overrides the master [eventStartEditable](#eventstarteditable) option for this single event. Default `undefined`
</td>
</tr>
<tr>
<td>

`display`
</td>
<td>

`string` The rendering type of the event. Can be `'auto'` or `'background'`. Default `'auto'`
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