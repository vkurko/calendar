# Event Calendar [![](https://data.jsdelivr.com/v1/package/npm/@event-calendar/build/badge)](https://www.jsdelivr.com/package/npm/@event-calendar/build) [![npm](https://img.shields.io/npm/dm/@event-calendar/core?color=red&label=npm&style=flat-square)](https://www.npmjs.com/package/@event-calendar/core)

See [demo](https://vkurko.github.io/calendar/) and [changelog](CHANGELOG.md).

Full-sized drag & drop JavaScript event calendar with resource view:

* Lightweight (28kb [br](https://en.wikipedia.org/wiki/Brotli) compressed)
* Zero-dependency (pre-built bundle)
* Used on over 70,000 websites with [Bookly](https://wordpress.org/plugins/bookly-responsive-appointment-booking-tool/)

Inspired by [FullCalendar](https://fullcalendar.io/), implements similar options.

## Table of contents
- [Usage](#usage)
  - [Svelte component / ES6 module](#svelte-component--es6-module)
  - [Pre-built browser ready bundle](#pre-built-browser-ready-bundle)
  - [Modifying options after initialization](#modifying-options-after-initialization)
- [Options](#options)
  <table>
  <tr><td>

  - [allDayContent](#alldaycontent)
  - [allDaySlot](#alldayslot)
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
  - [eventDragStop](#eventdragstop)
  - [eventDrop](#eventdrop)
  - [eventDurationEditable](#eventdurationeditable)
  </td><td>

  - [eventLongPressDelay](#eventlongpressdelay)
  - [eventMouseEnter](#eventmouseenter)
  - [eventMouseLeave](#eventmouseleave)
  - [eventResize](#eventresize)
  - [eventResizeStart](#eventresizestart)
  - [eventResizeStop](#eventresizestop)
  - [eventSources](#eventsources)
  - [eventStartEditable](#eventstarteditable)
  - [eventTextColor](#eventtextcolor)
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
  - [listDaySideFormat](#listdaysideformat)
  - [loading](#loading)
  - [locale](#locale)
  - [longPressDelay](#longpressdelay)
  - [moreLinkContent](#morelinkcontent)
  - [noEventsClick](#noeventsclick)
  - [noEventsContent](#noeventscontent)
  </td><td>

  - [nowIndicator](#nowindicator)
  - [pointer](#pointer)
  - [resources](#resources)
  - [resourceLabelContent](#resourcelabelcontent)
  - [resourceLabelDidMount](#resourcelabeldidmount)
  - [select](#select)
  - [selectable](#selectable)
  - [selectBackgroundColor](#selectbackgroundcolor)
  - [selectLongPressDelay](#selectlongpressdelay)
  - [selectMinDistance](#selectmindistance)
  - [scrollTime](#scrolltime)
  - [slotDuration](#slotduration)
  - [slotEventOverlap](#sloteventoverlap)
  - [slotHeight](#slotheight)
  - [slotLabelFormat](#slotlabelformat)
  - [slotMaxTime](#slotmaxtime)
  - [slotMinTime](#slotmintime)
  - [theme](#theme)
  - [titleFormat](#titleformat)
  - [unselect](#unselect)
  - [unselectAuto](#unselectauto)
  - [unselectCancel](#unselectcancel)
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

  - [dateFromPoint](#datefrompoint-x-y-)
  - [destroy](#destroy)
  - [getView](#getview)
  - [unselect](#unselect-1)
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
The CSS is located at `@event-calendar/core/index.css`. If your build tool supports CSS processing, you can import it like this:
```js
import '@event-calendar/core/index.css';
```

### Pre-built browser ready bundle
Include the following lines of code in the `<head>` section of your page:
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@event-calendar/build@1.4.1/event-calendar.min.css">
<script src="https://cdn.jsdelivr.net/npm/@event-calendar/build@1.4.1/event-calendar.min.js"></script>
```

<details>
  <summary>Note</summary>

> Please note that the file paths contain an indication of a specific version of the library. You can remove this indication, then the latest version will be loaded:
> ```html
> <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@event-calendar/build/event-calendar.min.css">
> <script src="https://cdn.jsdelivr.net/npm/@event-calendar/build/event-calendar.min.js"></script>
> ```
> But it is recommended to always specify the version and explicitly update it if necessary, in order to avoid unpredictable problems when a new version of the library is released.

</details>

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

### allDayContent
- Type `string`, `object`or `function`
- Default `'all-day'`

Defines the content that is displayed as a title of the `all-day` slot.

This value can be either a string containing text `'...'`, an object containing the HTML string `{html: '<p>...</p>'}`, an object containing an array of DOM nodes `{domNodes: [node1, node2, ...]}` or a function that returns any of the above formats:

```js
function (arg) {
    // return string or object
}
```
`arg` is an object with the following properties:
<table>
<tr>
<td>

`text`
</td>
<td>

The default text
</td>
</tr>
</table>

### allDaySlot
- Type `boolean`
- Default `true`

Determines whether the `all-day` slot is displayed at the top of the calendar.

When hidden with `false`, all-day events will not be displayed in `timeGrid`/`resourceTimeGrid` views.

### buttonText
- Type `object` or `function`
- Default `{today: 'today', dayGridMonth: 'month', listDay: 'list', listWeek: 'list', listMonth: 'list', listYear: 'list', resourceTimeGridDay: 'day', resourceTimeGridWeek: 'week', timeGridDay: 'day', timeGridWeek: 'week'}`

Text that is displayed in buttons of the header toolbar.

This value can be either a plain object with all necessary properties, or a callback function that receives default button texts object and should return a new one:

```js
function (texts) {
  // return new button texts object
}
```
<table>
<tr>
<td>

`texts`
</td>
<td>An object with default button texts</td>
</tr>
</table>

### date
- Type `Date` or `string`
- Default `new Date()`

Date that is currently displayed on the calendar.

This value can be either a JavaScript Date object, or an ISO8601 date string like `'2022-12-31'`.

### dateClick
- Type `function`
- Default `undefined`
- Requires `Interaction` plugin

Callback function that is triggered when the user clicks on a date or a time.

```js
function (info) {}
```
`info` is an object with the following properties:
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

`allDay`
</td>
<td>

`true` or `false`. Determines if the click has occurred in the `all-day` slot. Month and list views are also considered as all-day slots</td>
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
- Requires `Interaction` plugin

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
- Requires `Interaction` plugin

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
function (info) { }
```
`info` is an object with the following properties:
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

This value can be either a string containing text `'...'`, an object containing the HTML string `{html: '<p>...</p>'}`, an object containing an array of DOM nodes `{domNodes: [node1, node2, ...]}` or a function that returns any of the above formats:

```js
function (info) {
    // return string or object
}
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
function (info) { }
```
`info` is an object with the following properties:
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
- Requires `Interaction` plugin

Defines how many pixels the user’s mouse must move before the event dragging begins.

### eventDragStart
- Type `function`
- Default `undefined`
- Requires `Interaction` plugin

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
- Requires `Interaction` plugin

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
- Requires `Interaction` plugin

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
- Requires `Interaction` plugin

Determines whether calendar events can be resized.

### eventLongPressDelay
- Type `integer`
- Default `undefined`
- Requires `Interaction` plugin

For touch devices, the amount of time (in milliseconds) the user must hold down a tap before the event becomes draggable/resizable.

If not specified, it falls back to [longPressDelay](#longpressdelay).

### eventMouseEnter
- Type `function`
- Default `undefined`

Callback function that is triggered when the user hovers over an event with the cursor (mouse pointer).

```js
function (info) { }
```
`info` is an object with the following properties:
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
function (info) { }
```
`info` is an object with the following properties:
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
- Requires `Interaction` plugin

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
- Requires `Interaction` plugin

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
- Requires `Interaction` plugin

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
- Requires `Interaction` plugin

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

### eventTextColor
- Type `string`
- Default `undefined`

Sets the default text color for events on the calendar.

You can use any of the CSS color formats such `'#f00'`, `'#ff0000'`, `'rgb(255,0,0)'`, or `'red'`.

### filterResourcesWithEvents
- Type `boolean`
- Default `false`

Determines whether resources with no events for the current range should be hidden in the resource view.

### firstDay
- Type `integer`
- Default `0`

The day that each week begins at, where Sunday is `0`, Monday is `1`, etc. Saturday is `6`.

### flexibleSlotTimeLimits
- Type `boolean` or `object`
- Default `false`

Determines whether [slotMinTime](#slotmintime) and [slotMaxTime](#slotmaxtime) should automatically expand when an event goes out of bounds.

If set to `true`, then the decision on whether to expand the limits will be made based on the analysis of currently displayed events, but excluding background events.

If you want background events not to be ignored, then instead of `true` you can pass an object with the following properties:

<table>
<tr>
<td>

`eventFilter`
</td>
<td>

A function to determine whether a given event should be taken into account or not.

```js
function(event) {
    // return true or false
}
```
<table>
<tr>
<td>

`event`
</td>
<td>

[Event](#event-object) object to be analyzed.

The function must return `true` to have this event counted, or `false` to ignore it
</td>
</tr>
</table>

</td>
</tr>
</table>

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

### longPressDelay
- Type `integer`
- Default `1000`

For touch devices, the amount of time (in milliseconds) the user must hold down a tap before the event becomes draggable/resizable or the date becomes selectable.

For a more granular configuration, see [eventLongPressDelay](#eventlongpressdelay) and [selectLongPressDelay](#selectlongpressdelay).

### moreLinkContent
- Type `string`, `object`or `function`
- Default `undefined`

Defines the text that is displayed instead of the default `+2 more` created by the [dayMaxEvents](#daymaxevents) option.

This value can be either a string containing text `'...'`, an object containing the HTML string `{html: '<p>...</p>'}`, an object containing an array of DOM nodes `{domNodes: [node1, node2, ...]}` or a function that returns any of the above formats:

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
function (info) { }
```
`info` is an object with the following properties:
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

This value can be either a string containing text `'...'`, an object containing the HTML string `{html: '<p>...</p>'}`, an object containing an array of DOM nodes `{domNodes: [node1, node2, ...]}` or a function that returns any of the above formats:

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
- Requires `Interaction` plugin

Enables mouse cursor pointer in `timeGrid`/`resourceTimeGrid` views.

### resources
- Type `Array`
- Default `[]`

Array of plain objects that will be parsed into [Resource](#resource-object) objects for displaying in the resource view.

### resourceLabelContent
- Type `string`, `object`or `function`
- Default `undefined`

Defines the content that is rendered inside an element with a resource title.

This value can be either a string containing text `'...'`, an object containing the HTML string `{html: '<p>...</p>'}`, an object containing an array of DOM nodes `{domNodes: [node1, node2, ...]}` or a function that returns any of the above formats:

```js
function (info) {
    // return string or object
}
```
`info` is an object with the following properties:
<table>
<tr>
<td>

`resource`
</td>
<td>

The associated [Resource](#resource-object) object
</td>
</tr>
<tr>
<td>

`date`
</td>
<td>If it is a column that is within a specific date, this will be a Date object</td>
</tr>
</table>

### resourceLabelDidMount
- Type `function`
- Default `undefined`

Callback function that is triggered right after the element has been added to the DOM. If the resource data changes, this is not called again.

```js
function (info) { }
```
`info` is an object with the following properties:
<table>
<tr>
<td>

`el`
</td>
<td>The HTML element for the label</td>
</tr>
<tr>
<td>

`resource`
</td>
<td>

The associated [Resource](#resource-object) object
</td>
</tr>
<tr>
<td>

`date`
</td>
<td>If it is a column that is within a specific date, this will be a Date object</td>
</tr>
</table>

### select
- Type `function`
- Default `undefined`
- Requires `Interaction` plugin

Callback function that is triggered when a date/time selection is made.

```js
function (info) { }
```
`info` is an object with the following properties:
<table>
<tr>
<td>

`start`
</td>
<td>JavaScript Date object indicating the start of the selection</td>
</tr>
<tr>
<td>

`end`
</td>
<td>JavaScript Date object indicating the end of the selection</td>
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

`allDay`
</td>
<td>

`true` or `false`. Determines if the selection has occurred in the `all-day` slot</td>
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

If the current view is a resource view, the [Resource](#resource-object) object that was selected
</td>
</tr>
</table>

### selectable
- Type `boolean`
- Default `false`
- Requires `Interaction` plugin

Determines whether the user is allowed to highlight multiple days or time slots by clicking and moving the pointer.

### selectBackgroundColor
- Type `string`
- Default `undefined`
- Requires `Interaction` plugin

Sets the background color for the event indicating the current selection. See [selectable](#selectable).

You can use any of the CSS color formats such `'#f00'`, `'#ff0000'`, `'rgb(255,0,0)'`, or `'red'`.

### selectLongPressDelay
- Type `integer`
- Default `undefined`
- Requires `Interaction` plugin

For touch devices, the amount of time (in milliseconds) the user must hold down a tap before the date becomes selectable.

If not specified, it falls back to [longPressDelay](#longpressdelay).

### selectMinDistance
- Type `integer`
- Default `5`
- Requires `Interaction` plugin

Defines how many pixels the user’s mouse must move before the selection begins.

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

### slotEventOverlap
- Type `boolean`
- Default `true`

Determines whether events in the `timeGrid`/`resourceTimeGrid` views should visually overlap when they intersect in time.

If set to `false`, then intersecting events will be placed next to each other.

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
- Default `{active: 'ec-active', allDay: 'ec-all-day', bgEvent: 'ec-bg-event', bgEvents: 'ec-bg-events', body: 'ec-body', button: 'ec-button', buttonGroup: 'ec-button-group', calendar: 'ec', compact: 'ec-compact', content: 'ec-content', day: 'ec-day', dayFoot: 'ec-day-foot', dayHead: 'ec-day-head', daySide: 'ec-day-side', days: 'ec-days', draggable: 'ec-draggable', dragging: 'ec-dragging', event: 'ec-event', eventBody: 'ec-event-body', eventTag: 'ec-event-tag', eventTime: 'ec-event-time', eventTitle: 'ec-event-title', events: 'ec-events', extra: 'ec-extra', ghost: 'ec-ghost', handle: 'ec-handle', header: 'ec-header', hiddenScroll: 'ec-hidden-scroll', highlight: 'ec-highlight', icon: 'ec-icon', line: 'ec-line', lines: 'ec-lines', list: 'ec-list', month: 'ec-month', noEvents: 'ec-no-events', nowIndicator: 'ec-now-indicator', otherMonth: 'ec-other-month', pointer: 'ec-pointer', popup: 'ec-popup', preview: 'ec-preview', resizer: 'ec-resizer', resizingX: 'ec-resizing-x', resizingY: 'ec-resizing-y', resource: 'ec-resource', resourceTitle: 'ec-resource-title', selecting: 'ec-selecting', sidebar: 'ec-sidebar', sidebarTitle: 'ec-sidebar-title', time: 'ec-time', title: 'ec-title', today: 'ec-today', toolbar: 'ec-toolbar', uniform: 'ec-uniform', week: 'ec-week', withScroll: 'ec-with-scroll'}`

Defines the CSS classes that the Event Calendar uses to generate HTML markup.

This value can be either a plain object with all necessary properties, or a callback function that receives default theme object and should return a new one:

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

### unselect
- Type `function`
- Default `undefined`
- Requires `Interaction` plugin

Callback function that is triggered when the current selection is cleared.

A selection can be cleared for a number of reasons:

- The user clicks away from the current selection (this does not happen when [unselectAuto](#unselectauto) is `false`).
- The user makes a new selection. The unselect callback will be fired before the new selection occurs.
- The user navigates forward or backward in the current view, or switches to a new view.
- The [unselect](#unselect-1) method is called via the API.

```js
function (info) { }
```
`info` is an object with the following properties:
<table>
<tr>
<td>

`jsEvent`
</td>
<td>

JavaScript native event object with low-level information such as click coordinates.

If unselect has been triggered via the [unselect](#unselect-1) method, jsEvent will be `undefined`</td>
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

### unselectAuto
- Type `boolean`
- Default `true`
- Requires `Interaction` plugin

Determines whether clicking elsewhere on the page will clear the current selection. See [selectable](#selectable).

### unselectCancel
- Type `string`
- Default `''`
- Requires `Interaction` plugin

A CSS selector that specifies elements that will ignore the [unselectAuto](#unselectauto) option.

Clicking on elements that match this CSS selector will prevent the current selection from being cleared (because of the [unselectAuto](#unselectauto) option).

### view
- Type `string`
- Default `'resourceTimeGridWeek'`

The view that is displayed in the calendar. Can be `'dayGridMonth'`, `'listDay'`, `'listWeek'`, `'listMonth'`, `'listYear'`, `'resourceTimeGridDay'`, `'resourceTimeGridWeek'`, `'timeGridDay'` or `'timeGridWeek'`.

### viewDidMount
- Type `function`
- Default `undefined`

Callback function that is triggered right after the view has been added to the DOM.

```js
function (info) { }
```
`info` is an object with the following properties:
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

### dateFromPoint( x, y )
- Return value `object` or `null`

Returns an `info` object with data as if the [dateClick](#dateclick) event had fired for that point.

`info` object contains the following properties:
<table>
<tr>
<td>

`date`
</td>
<td>JavaScript Date object for the date and time</td>
</tr>
<tr>
<td>

`allDay`
</td>
<td>

`true` or `false`. Determines if the point is in the `all-day` slot. Month and list views are also considered as all-day slots</td>
</tr>
<tr>
<td>

`dayEl`
</td>
<td>HTML element that represents the whole-day that contains the point</td>
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

Using this method, you can, for example, find out on which day a click occurred inside a multi-day event. To do this, inside [eventClick](#eventclick), pass the `jsEvent.clientX` and `jsEvent.clientY` coordinates to `dateFromPoint` and get the desired date.

<details>
  <summary>Note</summary>

> In the `'listDay'`, `'listWeek'`, `'listMonth'` and `'listYear'` views, the events are rendered outside the day container, so the method will return `null` for the coordinates that are inside the events.

</details>

### destroy()
- Return value `undefined`

Destroys the calendar, removing all DOM elements, event handlers, and internal data.

### getView()
- Return value `View`

Returns the [View](#view-object) object for the current view.

### unselect()
- Return value `EventCalendar` The calendar instance for chaining

Clears the current selection. See [selectable](#selectable).

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
<td>The text appearing on the event</td>
</tr>
<tr>
<td>

`titleHTML`
</td>
<td>The HTML version of the title</td>
</tr>
<tr>
<td>

`editable`
</td>
<td>

`true`, `false` or `undefined`. The value overriding the [editable](#editable) setting for this specific event
</td>
</tr>
<tr>
<td>

`startEditable`
</td>
<td>

`true`, `false` or `undefined`. The value overriding the [eventStartEditable](#eventstarteditable) setting for this specific event
</td>
</tr>
<tr>
<td>

`durationEditable`
</td>
<td>

`true`, `false` or `undefined`. The value overriding the [eventDurationEditable](#eventdurationeditable) setting for this specific event
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

`textColor`
</td>
<td>

The [eventTextColor](#eventtextcolor) override for this specific event
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

`titleHTML`
</td>
<td>

`string` The HTML version of the title to be displayed instead of the text version. Default `''`
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

`textColor`
</td>
<td>

`string` Sets the event’s text color just like the calendar-wide [eventTextColor](#eventtextcolor) option. Default `undefined`
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
<tr>
<td>

`titleHTML`
</td>
<td>The HTML version of the title</td>
</tr>
<tr>
<td>

`eventBackgroundColor`
</td>
<td>Default background color for this resource's events</td>
</tr>
<tr>
<td>

`eventTextColor`
</td>
<td>Default text color for this resource's events</td>
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
<tr>
<td>

`titleHTML`
</td>
<td>

`string` The HTML version of the title to be displayed instead of the text version. Default `''`
</td>
</tr>
<tr>
<td>

`eventBackgroundColor`
</td>
<td>

`string` Sets the default background color for this resource's events just like the calendar-wide [eventBackgroundColor](#eventbackgroundcolor) option. Default `undefined`
</td>
</tr>
<tr>
<td>

`eventTextColor`
</td>
<td>

`string` Sets the default text color for this resource's events just like the calendar-wide [eventTextColor](#eventtextcolor) option. Default `undefined`
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

The latest versions of Chrome, Firefox, Safari, and Edge are supported.

> The library is compiled to support browsers that match the following browserslist configuration: `defaults and supports fetch`. You can see the resulting list [here](https://browsersl.ist/#q=defaults+and+supports+fetch).