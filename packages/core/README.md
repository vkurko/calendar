# EventCalendar [![](https://data.jsdelivr.com/v1/package/npm/@event-calendar/build/badge)](https://www.jsdelivr.com/package/npm/@event-calendar/build) [![npm](https://img.shields.io/npm/dm/@event-calendar/core?color=red&label=npm&style=flat-square)](https://www.npmjs.com/package/@event-calendar/core)

See [demo](https://vkurko.github.io/calendar/) and [changelog](CHANGELOG.md).

Full-sized drag & drop JavaScript event calendar with resource & timeline views:

* Lightweight (33kb [br](https://en.wikipedia.org/wiki/Brotli) compressed)
* 100% human-coded
* Zero-dependency (standalone bundle)
* Used on over 70,000 websites with [Bookly](https://wordpress.org/plugins/bookly-responsive-appointment-booking-tool/)

Inspired by [FullCalendar](https://fullcalendar.io/), it implements similar options.

### Featured sponsors

<table>
<tr>
<td>

[![@steveb85](https://avatars.githubusercontent.com/u/50031994?s=52&v=4)](https://github.com/steveb85)
</td>
<td>

:heavy_plus_sign: [Get on the list](https://github.com/sponsors/vkurko)
</td>
</tr>
</table>

## Table of contents
- [Usage](#usage)
  - [JavaScript module](#javascript-module)
  - [Svelte 5 component](#svelte-5-component)
  - [Standalone bundle](#standalone-bundle)
  - [Modifying options after initialization](#modifying-options-after-initialization)
- [Options](#options)
  <table>
  <tr><td>

  - [allDayContent](#alldaycontent)
  - [allDaySlot](#alldayslot)
  - [buttonText](#buttontext)
  - [customButtons](#custombuttons)
  - [date](#date)
  - [dateClick](#dateclick)
  - [datesAboveResources](#datesaboveresources)
  - [datesSet](#datesset)
  - [dayCellFormat](#daycellformat)
  - [dayHeaderAriaLabelFormat](#dayheaderarialabelformat)
  - [dayHeaderFormat](#dayheaderformat)
  - [dayMaxEvents](#daymaxevents)
  - [dayPopoverFormat](#daypopoverformat)
  - [displayEventEnd](#displayeventend)
  - [dragConstraint](#dragconstraint)
  - [dragScroll](#dragscroll)
  - [duration](#duration)
  - [editable](#editable)
  - [events](#events)
  - [eventAllUpdated](#eventallupdated)
  - [eventBackgroundColor](#eventbackgroundcolor)
  - [eventClassNames](#eventclassnames)
  - [eventClick](#eventclick)
  - [eventColor](#eventcolor)
  - [eventContent](#eventcontent)
  - [eventDidMount](#eventdidmount)
  - [eventDragMinDistance](#eventdragmindistance)
  - [eventDragStart](#eventdragstart)
  - [eventDragStop](#eventdragstop)
  - [eventDrop](#eventdrop)
  </td><td>

  - [eventDurationEditable](#eventdurationeditable)
  - [eventFilter](#eventfilter)
  - [eventLongPressDelay](#eventlongpressdelay)
  - [eventMouseEnter](#eventmouseenter)
  - [eventMouseLeave](#eventmouseleave)
  - [eventResizableFromStart](#eventresizablefromstart)
  - [eventResize](#eventresize)
  - [eventResizeStart](#eventresizestart)
  - [eventResizeStop](#eventresizestop)
  - [eventSources](#eventsources)
  - [eventStartEditable](#eventstarteditable)
  - [eventTextColor](#eventtextcolor)
  - [eventTimeFormat](#eventtimeformat)
  - [filterEventsWithResources](#filtereventswithresources)
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
  - [nowIndicator](#nowindicator)
  </td><td>

  - [pointer](#pointer)
  - [resizeConstraint](#resizeconstraint)
  - [resources](#resources)
  - [resourceLabelContent](#resourcelabelcontent)
  - [resourceLabelDidMount](#resourcelabeldidmount)
  - [scrollTime](#scrolltime)
  - [select](#select)
  - [selectable](#selectable)
  - [selectBackgroundColor](#selectbackgroundcolor)
  - [selectConstraint](#selectconstraint)
  - [selectLongPressDelay](#selectlongpressdelay)
  - [selectMinDistance](#selectmindistance)
  - [slotDuration](#slotduration)
  - [slotEventOverlap](#sloteventoverlap)
  - [slotHeight](#slotheight)
  - [slotLabelFormat](#slotlabelformat)
  - [slotLabelInterval](#slotlabelinterval)
  - [slotMaxTime](#slotmaxtime)
  - [slotMinTime](#slotmintime)
  - [slotWidth](#slotwidth)
  - [theme](#theme)
  - [titleFormat](#titleformat)
  - [unselect](#unselect)
  - [unselectAuto](#unselectauto)
  - [unselectCancel](#unselectcancel)
  - [validRange](#validrange)
  - [view](#view)
  - [viewDidMount](#viewdidmount)
  - [views](#views)
  - [weekNumberContent](#weeknumbercontent)
  - [weekNumbers](#weeknumbers)
  </td></tr>
  </table>
- [Methods](#methods)
  <table>
  <tr><td>

  - [getOption](#getoption-name-)
  - [setOption](#setoption-name-value-)
  </td><td>

  - [addEvent](#addevent-event-)
  - [getEventById](#geteventbyid-id-)
  - [getEvents](#getevents)
  - [removeEventById](#removeeventbyid-id-)
  - [updateEvent](#updateevent-event-)
  - [refetchEvents](#refetchevents)
  </td><td>

  - [dateFromPoint](#datefrompoint-x-y-)
  - [getView](#getview)
  - [next](#next)
  - [prev](#prev)
  - [unselect](#unselect-1)
  </td></tr>
  </table>
- [Content](#content)
- [Event object](#event-object)
  - [Parsing event from a plain object](#parsing-event-from-a-plain-object)
- [Duration object](#duration-object)
  - [Parsing duration from input values](#parsing-duration-from-input-values)
- [Resource object](#resource-object)
  - [Parsing resource from a plain object](#parsing-resource-from-a-plain-object)
- [View object](#view-object)
- [Theming](#theming)
- [Browser support](#browser-support)

## Usage
### JavaScript module
The first step is to install the EventCalendar `core` package:
```bash
npm install --save-dev @event-calendar/core
```
This package provides functions for creating and destroying the calendar, as well as plugins for various views. You must use at least one plugin that provides a view. The following plugins are currently available:

* `DayGrid`
* `List`
* `ResourceTimeline`
* `ResourceTimeGrid`
* `TimeGrid`
* `Interaction` (doesn't provide a view)

Then, in your JavaScript module:
```js
import {createCalendar, destroyCalendar, TimeGrid} from '@event-calendar/core';
// Import CSS if your build tool supports it
import '@event-calendar/core/index.css';

let ec = createCalendar(
    // HTML element the calendar will be mounted to
    document.getElementById('ec'),
    // Array of plugins
    [TimeGrid],
    // Options object
    {
        view: 'timeGridWeek',
        events: [
            // your list of events
        ]
    }
);

// If you later need to destroy the calendar then use
destroyCalendar(ec);
```

### Svelte 5 component
The first step is to install the EventCalendar `core` package:
```bash
npm install --save-dev @event-calendar/core
```
This package provides the `Calendar` component, as well as plugins for various views. You must use at least one plugin that provides a view. The following plugins are currently available:

* `DayGrid`
* `List`
* `ResourceTimeline`
* `ResourceTimeGrid`
* `TimeGrid`
* `Interaction` (doesn't provide a view)

Then in your Svelte 5 component, use the calendar like this:
```html
<script>
    import {Calendar, TimeGrid} from '@event-calendar/core';

    let options = $state({
        view: 'timeGridWeek',
        events: [
            // your list of events
        ]
    });
</script>

<Calendar plugins={[TimeGrid]} {options} />
```
The calendar is destroyed gracefully when the component containing it is destroyed.

### Standalone bundle
This bundle contains a version of the calendar that includes all plugins and is prepared for use in the browser via the `<script>` tag.

The first step is to include the following lines of code in the `<head>` section of your page:
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@event-calendar/build@4.5.2/dist/event-calendar.min.css">
<script src="https://cdn.jsdelivr.net/npm/@event-calendar/build@4.5.2/dist/event-calendar.min.js"></script>
```

<details>
  <summary>Note</summary>

> Please note that the file paths contain an indication of a specific version of the library. You can remove this indication, then the latest version will be loaded:
> ```html
> <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@event-calendar/build/dist/event-calendar.min.css">
> <script src="https://cdn.jsdelivr.net/npm/@event-calendar/build/dist/event-calendar.min.js"></script>
> ```
> But it is recommended to always specify the version and explicitly update it if necessary, in order to avoid unpredictable problems when a new version of the library is released.

</details>

Then initialize the calendar like this:
```js
let ec = EventCalendar.create(document.getElementById('ec'), {
    view: 'timeGridWeek',
    events: [
        // your list of events
    ]
});

// If you later need to destroy the calendar then use
EventCalendar.destroy(ec);
```

### Modifying options after initialization
You can modify the calendar options after initialization using the [setOption](#setoption-name-value-) method.
```js
ec.setOption('slotDuration', '01:00');
```
In Svelte, you can simply update the original `options` object.
```html
<script>
    import {Calendar, TimeGrid} from '@event-calendar/core';

    let options = $state({
        view: 'timeGridWeek'
    });

    function updateOptions() {
        options.slotDuration = '01:00';
    }
</script>

<button onclick={updateOptions}>Change slot duration</button>
<Calendar plugins={[TimeGrid]} {options} />
```

## Options

### allDayContent
- Type `Content` or `function`
- Default `'all-day'`

Defines the content that is displayed as a title of the `all-day` slot.

This value can be either a [Content](#content) or a function that returns content:

```js
function (arg) {
    // return Content
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
- Default `{close: 'Close', dayGridMonth: 'month', listDay: 'list', listMonth: 'list', listWeek: 'list', listYear: 'list', resourceTimeGridDay: 'resources', resourceTimeGridWeek: 'resources', resourceTimelineDay: 'timeline', resourceTimelineMonth: 'timeline', resourceTimelineWeek: 'timeline', timeGridDay: 'day', timeGridWeek: 'week', today: 'today'}`
> Views override the default value as follows:
> - dayGridMonth `text => ({...text, next: 'Next month', prev: 'Previous month'})`
> - listDay `text => ({...text, next: 'Next day', prev: 'Previous day'})`
> - listMonth `text => ({...text, next: 'Next month', prev: 'Previous month'})`
> - listWeek `text => ({...text, next: 'Next week', prev: 'Previous week'})`
> - listYear `text => ({...text, next: 'Next year', prev: 'Previous year'})`
> - resourceTimeGridDay `text => ({...text, next: 'Next day', prev: 'Previous day'})`
> - resourceTimeGridWeek `text => ({...text, next: 'Next week', prev: 'Previous week'})`
> - resourceTimelineDay `text => ({...text, next: 'Next day', prev: 'Previous day'})`
> - resourceTimelineMonth `text => ({...text, next: 'Next month', prev: 'Previous month'})`
> - resourceTimelineWeek `text => ({...text, next: 'Next week', prev: 'Previous week'})`
> - timeGridDay `text => ({...text, next: 'Next day', prev: 'Previous day'})`
> - timeGridWeek `text => ({...text, next: 'Next week', prev: 'Previous week'})`

Text that is displayed in buttons of the header toolbar.

This value can be either a plain object with all necessary properties, or a callback function that receives default button text object and should return a new one:

```js
function (text) {
  // return new button text object
}
```
<table>
<tr>
<td>

`text`
</td>
<td>An object with default button text</td>
</tr>
</table>

### customButtons
- Type `object`
- Default `{}`

Defines custom buttons that can be used in the [headerToolbar](#headertoolbar).

First, specify the custom buttons as key-value pairs. Then reference them from the `headerToolbar` option.

<details>
  <summary>Example</summary>

```js
let options = {
    customButtons: {
        myCustomButton: {
            text: 'custom!',
            click: function() {
                alert('clicked the custom button!');
            }
        }
    },
    headerToolbar: {
        start: 'title myCustomButton',
        center: '',
        end: 'today prev,next'
    }
};
```
</details>

Each `customButton` entry accepts the following properties:
<table>
<tr>
<td>

`text`
</td>
<td>

The text to be display on the button itself. See [Content](#content)
</td>
</tr>
<tr>
<td>

`click`
</td>
<td>A callback function that is called when the button is clicked. Accepts one argument <a href="https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent">mouseEvent</a></td>
</tr>
<tr>
<td>

`active`
</td>
<td>

If `true`, the button will appear pressed/active
</td>
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

### dayCellFormat
- Type `object` or `function`
- Default `{day: 'numeric'}`

Defines the text that is displayed inside the day cell in the `dayGrid` view.

This value can be either an object with options for the native JavaScript [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat) object, or a callback function that returns a [Content](#content) with the formatted string:

```js
function (date) {
  // return Content with the formatted date string
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

### dayHeaderAriaLabelFormat
- Type `object` or `function`
- Default `{dateStyle: 'long'}`
> Views override the default value as follows:
> - dayGridMonth `{weekday: 'long'}`

Defines the text that is used inside the `aria-label` attribute in calendar column headings.

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

### dayHeaderFormat
- Type `object` or `function`
- Default `{weekday: 'short', month: 'numeric', day: 'numeric'}`
> Views override the default value as follows:
> - dayGridMonth `{weekday: 'short'}`
> - resourceTimelineMonth `{weekday: 'short', day: 'numeric'}`
> - timeGridDay `{weekday: 'long'}`

Defines the text that is displayed on the calendar’s column headings.

This value can be either an object with options for the native JavaScript [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat) object, or a callback function that returns a [Content](#content) with the formatted string:

```js
function (date) {
    // return Content with the formatted date string
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

This value can be either an object with options for the native JavaScript [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat) object, or a callback function that returns a [Content](#content) with the formatted string:

```js
function (date) {
    // return Content with the formatted date string
}
```
### displayEventEnd
- Type `boolean`
- Default `true`
> Views override the default value as follows:
> - dayGridMonth `false`
> - resourceTimelineDay `false`
> - resourceTimelineMonth `false`
> - resourceTimelineWeek `false`

Determines whether to display an event’s end time.

### dragConstraint
- Type `function`
- Default `undefined`
- Requires `Interaction` plugin

Callback function that limits the date/time range into which events are allowed to be dragged.

The function is triggered during dragging for each cursor movement and takes the same parameters as [eventDrop](#eventdrop). The function should return `true` if dragging to the new position is allowed, and `false` otherwise.

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
> - listMonth `{months: 1}`
> - listYear `{years: 1}`
> - resourceTimeGridDay `{days: 1}`
> - resourceTimelineDay `{days: 1}`
> - resourceTimelineMonth `{months: 1}`
> - timeGridDay `{days: 1}`

Sets the duration of a view.

This should be a value that can be parsed into a [Duration](#duration-object) object.

### editable
- Type `boolean`
- Default `false`
- Requires `Interaction` plugin

Determines whether the events on the calendar can be dragged and resized (both at the same time).

If you don't need both, use the more specific [eventStartEditable](#eventstarteditable) and [eventDurationEditable](#eventdurationeditable) instead.

### events
- Type `array`
- Default `[]`

Array of plain objects that will be parsed into [Event](#event-object) objects and displayed on the calendar.

This option is not used if the `eventSources` option is provided.

### eventAllUpdated
- Type `function`
- Default `undefined`

Callback function that is triggered when all events have finished updating.

This is an experimental feature and its behavior may change in the future. The function is called at the end of the cycle of rendering all events. The rendering occurs when new events are added, already displayed events are modified, or events are deleted.

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

The current [View](#view-object) object
</td>
</tr>
</table>

### eventBackgroundColor
- Type `string`
- Default `undefined`

Sets the default background color for events on the calendar.

You can use any of the CSS color formats such `'#f00'`, `'#ff0000'`, `'rgb(255,0,0)'`, or `'red'`.

### eventClassNames
- Type `string`, `array` or `function`
- Default `undefined`

Sets additional CSS classes for events.

This value can be either a string containing class names `'class-1 class-2 ...'`, an array of strings `['class-1', 'class-2', ...]` or a function that returns any of the above formats:

```js
function (info) {
    // return string or array
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

`view`
</td>
<td>

The current [View](#view-object) object
</td>
</tr>
</table>

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
- Type `Content` or `function`
- Default `undefined`

Defines the content that is rendered inside an event’s element.

This value can be either a [Content](#content) or a function that returns content or `undefined`:

```js
function (info) {
    // return Content or undefined
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

In case the function returns `undefined`, the event will be rendered in the default way.

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

### eventFilter
- Type `function`
- Default `undefined`

A function for filtering the array of events before displaying them in the calendar. It allows, for example, to display only specific events for each view.

```js
function (info) {
    // return true to keep the event, false to exclude it
}
```
`info` is an object with the following properties:
<table>
<tr>
<td>

`event`
</td>
<td>

The current [Event](#event-object) object being processed in the array
</td>
</tr>
<tr>
<td>

`index`
</td>
<td>The index of the current event being processed in the array</td>
</tr>
<tr>
<td>

`events`
</td>
<td>

The array of all events `eventFilter` was called upon
</td>
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

### eventResizableFromStart
- Type `boolean`
- Default `false`
- Requires `Interaction` plugin

Determines whether the event can be resized from its starting edge.

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

`startDelta`
</td>
<td>

A [Duration](#duration-object) object that represents the amount of time the event’s start date was moved by
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

Array of `EventSource` objects that will provide EventCalendar with data about events.

This option is used instead of the `events` option.

`EventSource` should be an object with one of the following sets of properties:

#### 1. Fetch events from a URL
<table>
<tr>
<td>

`url`
</td>
<td>

A URL that the calendar will fetch [Event](#event-object) objects from. HTTP requests with the following parameters will be sent to this URL whenever the calendar needs new event data:
<table>
<tr>
<td>

`start`
</td>
<td>
Start date of the range the calendar needs events for
</td>
</tr>
<tr>
<td>

`end`
</td>
<td>
End date of the range the calendar needs events for
</td>
</tr>
</table>
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

A custom function that is executed whenever EventCalendar needs new event data.

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

This value can be either an object with options for the native JavaScript [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat) object, or a callback function that returns a [Content](#content) with the formatted string:

```js
function (start, end) {
    // return Content with the formatted time string
}
```
<table>
<tr>
<td>

`start`
</td>
<td>JavaScript Date object containing the beginning of the time span to be formatted</td>
</tr>
<tr>
<td>

`end`
</td>
<td>JavaScript Date object containing the end of the time span to be formatted</td>
</tr>
</table>

### eventTextColor
- Type `string`
- Default `undefined`

Sets the default text color for calendar events (except for `list` view).

You can use any of the CSS color formats such `'#f00'`, `'#ff0000'`, `'rgb(255,0,0)'`, or `'red'`.

### filterEventsWithResources
- Type `boolean`
- Default `false`

Determines whether events that do not belong to the current array of [resources](#resources) should be hidden in `dayGrid`/`timeGrid`/`list` views.

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
- Default `undefined`

Defines the height of the entire calendar.

This should be a valid CSS value like `'100%'` or `'600px'`.

### hiddenDays
- Type `array`
- Default `[]`

Exclude certain days-of-the-week from being displayed, where Sunday is `0`, Monday is `1`, etc. Saturday is `6`.

### highlightedDates
- Type `array`
- Default `[]`

Array of dates that need to be highlighted in the calendar.

Each date can be either an ISO8601 date string like `'2022-12-31'`, or a JavaScript Date object.

### lazyFetching
- Type `boolean`
- Default `true`

Determines when event fetching should occur.

When set to `true` (the default), the calendar will only fetch events when it absolutely needs to, minimizing HTTP requests. For example, say your calendar starts out in month view, in February. EventCalendar will fetch events for the entire month of February and store them in its internal storage. Then, say the user switches to week view and begins browsing the weeks in February. The calendar will avoid fetching events because it already has this information stored.

When set to `false`, the calendar will fetch events any time the view is switched, or any time the current date changes (for example, as a result of the user clicking prev/next).

### listDayFormat
- Type `object` or `function`
- Default `{weekday: 'long'}`

Defines the text on the left side of the day headings in list view.

This value can be either an object with options for the native JavaScript [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat) object, or a callback function that returns a [Content](#content) with the formatted string:

```js
function (date) {
  // return Content with the formatted date string
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

This value can be either an object with options for the native JavaScript [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat) object, or a callback function that returns a [Content](#content) with the formatted string:

```js
function (date) {
  // return Content with the formatted date string
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

Defines the `locales` parameter for the native JavaScript [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#locales) object that EventCalendar uses to format date and time strings in options such as [dayHeaderFormat](#dayheaderformat), [eventTimeFormat](#eventtimeformat), etc.

### longPressDelay
- Type `integer`
- Default `1000`

For touch devices, the amount of time (in milliseconds) the user must hold down a tap before the event becomes draggable/resizable or the date becomes selectable.

For a more granular configuration, see [eventLongPressDelay](#eventlongpressdelay) and [selectLongPressDelay](#selectlongpressdelay).

### moreLinkContent
- Type `Content` or `function`
- Default `undefined`

Defines the text that is displayed instead of the default `+2 more` created by the [dayMaxEvents](#daymaxevents) option.

This value can be either a [Content](#content) or a function that returns content:

```js
function (arg) {
  // return Content
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
- Type `Content` or `function`
- Default `'No events'`

Defines the text that is displayed in list view when there are no events to display.

This value can be either a [Content](#content) or a function that returns content:

```js
function () {
  // return Content
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

Enables mouse cursor pointer in `timeGrid`/`resourceTimeGrid` and other views.

### resizeConstraint
- Type `function`
- Default `undefined`
- Requires `Interaction` plugin

Callback function that limits the date/time range within which the event is allowed to resize.

The function is triggered during resizing for each cursor movement and takes the same parameters as [eventResize](#eventresize). The function should return `true` if the new size is allowed, and `false` otherwise.

### resources
- Type `array`
- Default `[]`

Array of plain objects that will be parsed into [Resource](#resource-object) objects for displaying in the resource view.

### resourceLabelContent
- Type `string`, `object`or `function`
- Default `undefined`

Defines the content that is rendered inside an element with a resource title.

This value can be either a [Content](#content) or a function that returns content:

```js
function (info) {
    // return Content
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

### scrollTime
- Type `string`, `integer` or `object`
- Default `'06:00:00'`

Determines how far forward the scroll pane is initially scrolled.

This should be a value that can be parsed into a [Duration](#duration-object) object.

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

### selectConstraint
- Type `function`
- Default `undefined`
- Requires `Interaction` plugin

Callback function that limits the date/time range that can be selected.

The function is triggered during selection for each cursor movement and takes the same parameters as [select](#select). The function should return `true` if the selected range is allowed, and `false` otherwise.

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

### slotDuration
- Type `string`, `integer` or `object`
- Default `'00:30:00'`
> Views override the default value as follows:
> - resourceTimelineMonth `{days: 1}`

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

Defines the time slot height in pixels in the `timeGrid`/`resourceTimeGrid` views. When changing the setting, you must additionally override the following CSS styles:

```css
.ec-time-grid .ec-time, .ec-time-grid .ec-line {
  height: 24px;  /* override this value */
}
```

### slotLabelFormat
- Type `object` or `function`
- Default `{hour: 'numeric', minute: '2-digit'}`

Defines the text that will be displayed within a time slot.

This value can be either an object with options for the native JavaScript [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat) object, or a callback function that returns a [Content](#content) with the formatted string:

```js
function (time) {
  // return Content with the formatted time string
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

### slotLabelInterval
- Type `string`, `integer` or `object`
- Default `undefined`

The interval at which slot labels should be displayed in `timeGrid`/`resourceTimeline` views.

This should be a value that can be parsed into a [Duration](#duration-object) object.

If not specified, then if `slotDuration` is less than 1 hour, the interval is considered to be twice as long, i.e. the labels are displayed every other time.

If the interval is set to zero, then labels are displayed for all slots, including the very first one, which is not normally displayed in `timeGrid` views.

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

### slotWidth
- Type `integer`
- Default `72`

Defines the time slot width in pixels in `resourceTimeline` views. When changing the setting, you must additionally override the following CSS styles:

```css
.ec-timeline .ec-time, .ec-timeline .ec-line {
  width: 72px;  /* override this value */
}
```

### theme
- Type `object` or `function`
- Default `{allDay: 'ec-all-day', active: 'ec-active', bgEvent: 'ec-bg-event', bgEvents: 'ec-bg-events', body: 'ec-body', button: 'ec-button', buttonGroup: 'ec-button-group', calendar: 'ec', container: 'ec-container', content: 'ec-content', day: 'ec-day', dayHead: 'ec-day-head', dayFoot: 'ec-day-foot', days: 'ec-days', daySide: 'ec-day-side', draggable: 'ec-draggable', dragging: 'ec-dragging', event: 'ec-event', eventBody: 'ec-event-body', eventTag: 'ec-event-tag', eventTime: 'ec-event-time', eventTitle: 'ec-event-title', events: 'ec-events', expander: 'ec-expander', extra: 'ec-extra', ghost: 'ec-ghost', handle: 'ec-handle', header: 'ec-header', hiddenScroll: 'ec-hidden-scroll', highlight: 'ec-highlight', icon: 'ec-icon', line: 'ec-line', lines: 'ec-lines', main: 'ec-main', minor: 'ec-minor', noEvents: 'ec-no-events', nowIndicator: 'ec-now-indicator', otherMonth: 'ec-other-month', pointer: 'ec-pointer', popup: 'ec-popup', preview: 'ec-preview', resizer: 'ec-resizer', resizingX: 'ec-resizing-x', resizingY: 'ec-resizing-y', resource: 'ec-resource', selecting: 'ec-selecting', sidebar: 'ec-sidebar', sidebarTitle: 'ec-sidebar-title', today: 'ec-today', time: 'ec-time', times: 'ec-times', title: 'ec-title', toolbar: 'ec-toolbar', view: 'ec-timeline ec-resource-week-view', weekdays: ['ec-sun', 'ec-mon', 'ec-tue', 'ec-wed', 'ec-thu', 'ec-fri', 'ec-sat'], withScroll: 'ec-with-scroll', uniform: 'ec-uniform'}`
> Views override the default value as follows:
> - dayGridMonth `theme => ({...theme, view: 'ec-day-grid ec-month-view'})`
> - listDay `theme => ({...theme, view: 'ec-list ec-day-view'})`
> - listMonth `theme => ({...theme, view: 'ec-list ec-month-view'})`
> - listWeek `theme => ({...theme, view: 'ec-list ec-week-view'})`
> - listYear `theme => ({...theme, view: 'ec-list ec-year-view'})`
> - resourceTimeGridDay `theme => ({...theme, view: 'ec-time-grid ec-resource-day-view'})`
> - resourceTimeGridWeek `theme => ({...theme, view: 'ec-time-grid ec-resource-week-view'})`
> - resourceTimelineDay `theme => ({...theme, view: 'ec-timeline ec-resource-day-view'})`
> - resourceTimelineMonth `theme => ({...theme, view: 'ec-timeline ec-resource-month-view'})`
> - resourceTimelineWeek `theme => ({...theme, view: 'ec-timeline ec-resource-week-view'})`
> - timeGridDay `theme => ({...theme, view: 'ec-time-grid ec-day-view'})`
> - timeGridWeek `theme => ({...theme, view: 'ec-time-grid ec-week-view'})`

Defines the CSS classes that EventCalendar uses to generate HTML markup.

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

This value can be either an object with options for the native JavaScript [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat) object, or a callback function that returns a [Content](#content) with the formatted string:

```js
function (start, end) {
  // return Content with the formatted date string
}
```
<table>
<tr>
<td>

`start`
</td>
<td>JavaScript Date object containing the beginning of the time span to be formatted</td>
</tr>
<tr>
<td>

`end`
</td>
<td>JavaScript Date object containing the end of the time span to be formatted</td>
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

### validRange
- Type `object`
- Default `undefined`

If set, the calendar will allow navigation only within the specified date range. Navigation buttons will be grayed out to prevent the user from navigating to an invalid range.

The range should be an object with the following properties:
<table>
<tr>
<td>

`start`
</td>
<td>

`string` or `Date` This should be either an ISO8601 date string like `'2025-12-31'`, or a JavaScript Date object holding the range start date
</td>
</tr>
<tr>
<td>

`end`
</td>
<td>

`string` or `Date` This should be either an ISO8601 date string like `'2025-12-31'`, or a JavaScript Date object holding the range end date
</td>
</tr>
</table>

It is not necessary to specify both properties. The range may have only `start` and no `end`, or vice versa.

### view
- Type `string`
- Default `'resourceTimeGridWeek'`

The view that is displayed in the calendar. Can be `'dayGridMonth'`, `'listDay'`, `'listWeek'`, `'listMonth'`, `'listYear'`, `'resourceTimeGridDay'`, `'resourceTimeGridWeek'`, `'resourceTimelineDay'`, `'resourceTimelineWeek'`, `'resourceTimelineMonth'`, `'timeGridDay'` or `'timeGridWeek'`.

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

### weekNumberContent
- Type `Content` or `function`
- Default `undefined`

Defines the text that is displayed in place of the default week number (such as `W01`).

This value can be either a [Content](#content) or a function that returns content:

```js
function (arg) {
  // return Content
}
```
`arg` is an object with the following properties:
<table>
<tr>
<td>

`date`
</td>
<td>JavaScript Date object containing the day within which the week number will be displayed</td>
</tr>
<tr>
<td>

`week`
</td>
<td>Calculated week number</td>
</tr>
</table>

### weekNumbers
- Type `boolean`
- Default `false`

Determines whether week numbers should be displayed in the `dayGrid` view.

The numbering of weeks depends on the value of [firstDay](#firstday). When `firstDay` is `0`, the [Western](https://en.wikipedia.org/wiki/Week#Other_week_numbering_systems) system is used. Any other value uses the [ISO](https://en.wikipedia.org/wiki/Week#The_ISO_week_date_system) system.

## Methods
Methods allow you to manipulate EventCalendar after initialization. They are accessible from the calendar instance.

In Svelte, methods are available from a component instance:
```html
<script>
    import {Calendar, TimeGrid} from '@event-calendar/core';

    let ec = $state();
    let options = $state({
        view: 'timeGridWeek',
        eventSources: [{events: function() {
            console.log('fetching...');
            return [];
        }}]
    });

    function invokeMethod() {
        ec.refetchEvents();
    }
</script>

<button onclick={invokeMethod}>Refetch events</button>
<Calendar bind:this={ec} plugins={[TimeGrid]} {options} />
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

### addEvent( event )
- Parameters
  - `event` `object` A plain object that will be parsed into an [Event](#event-object) object
- Return value [Event](#event-object) object or `null`

Adds a new event to the calendar.

### getEventById( id )
- Parameters
  - `id` `string|integer` The ID of the event
- Return value [Event](#event-object) object or `null`

Returns a single event with the matching `id`.

### getEvents()
- Return value `Event[]` Array of [Event](#event-object) objects

Returns an array of events that the calendar has in memory.

### removeEventById( id )
- Parameters
  - `id` `string|integer` The ID of the event
- Return value `EventCalendar` The calendar instance for chaining

Removes a single event with the matching `id`.

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

### getView()
- Return value `View`

Returns the [View](#view-object) object for the current view.

### next()
- Return value `EventCalendar` The calendar instance for chaining

Moves the current calendar date forward by 1 day/week/month (depending on the current view).

### prev()
- Return value `EventCalendar` The calendar instance for chaining

Moves the current calendar date backward by 1 day/week/month (depending on the current view).

### unselect()
- Return value `EventCalendar` The calendar instance for chaining

Clears the current selection. See [selectable](#selectable).

## Content
The content value can be presented in the following forms:

* a string containing text `'some text'`
* an object containing the HTML string `{html: '<p>some HTML</p>'}`
* an object containing an array of DOM nodes `{domNodes: [node1, node2, ...]}`

## Event object
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

`Content` The text appearing on the event. See [Content](#content)</td>
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

### Parsing event from a plain object
When EventCalendar receives an array of plain event’s objects either from the `events` option or as a result of an HTTP request to a URL of an event source, it parses the input objects into proper Event objects.

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

`Content` The text that will appear on the event. See [Content](#content). Default `''`
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

`durationEditable`
</td>
<td>

`boolean` Overrides the master [eventDurationEditable](#eventdurationeditable) option for this single event. Default `undefined`
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

`classNames` or `className`
</td>
<td>

`string` or `array` Sets additional CSS classes for this single event. See [eventClassNames](#eventclassnames). Default `[]`
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

## Duration object
This is a JavaScript object that EventCalendar uses to store information about a period of time, like _30 minutes_ or _1 day and 6 hours_.

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
When EventCalendar receives a value for options like `duration`, `scrollTime`, `slotDuration` and others, it parses it into a proper Duration object.

The admissible input value can be specified in one of three formats:
- an object with any of the following keys: `year`, `years`, `month`, `months`, `day`, `days`, `minute`, `minutes`, `second`, `seconds`
- a string in the format `hh:mm:ss` or `hh:mm`. For example, `'05:00'` specifies 5 hours
- an integer specifying the total number of seconds

## Resource object
This is a JavaScript object that EventCalendar uses to store information about a resource. Calendar events can be associated with resources and displayed separately using the resource view.

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
<td>

The title of the resource. See [Content](#content)
</td>
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
<tr>
<td>

`extendedProps`
</td>
<td>

A plain object holding miscellaneous properties specified during parsing in the explicitly given `extendedProps` field
</td>
</tr>
</table>

### Parsing resource from a plain object
When EventCalendar receives an array of plain resource’s objects for the `resources` option, it parses the input objects into proper Resource objects.

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

`Content` Text that will be displayed on the resource when it is rendered. See [Content](#content). Default `''`
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
<tr>
<td>

`extendedProps`
</td>
<td>

`object` A plain object with any miscellaneous properties. It will be directly transferred to the `extendedProps` property of the Resource object. Default `{}`
</td>
</tr>
<tr>
<td>

`children`
</td>
<td>Nested resources. See below</td>
</tr>
</table>

The `timeline` views support displaying nested resources. Nested resources can be collapsed or expanded using an additional button that appears before the parent resource name. To pass nested resources, use the `children` field:

```js
resources: [
  {
    id: 1,
    title: 'Resource A',
    children: [
      {
        id: 11,
        title: 'Resource A1'
      },
      {
        id: 12,
        title: 'Resource A2'
      }
    ]
  }
]
```

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

## Theming

The library provides a built-in dark theme. You can activate it by adding the `ec-dark` CSS class to any parent element of the calendar, e.g. `<body class="ec-dark">`.

If you want the dark theme to be activated automatically based on the [preferred color scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme), then use the `ec-auto-dark` CSS class instead.

Please note that the dark theme does not change the background and font color in the calendar. These are assumed to be set by the page styles, and the calendar inherits these styles.

If you do need to set the background or font color of the calendar, use local CSS variables for this:
```css
.ec {
  --ec-bg-color: #22272e;
  --ec-text-color: #adbac7;
}
```
A list of all available CSS variables can be found [here](packages/core/src/styles/theme.scss).

## Browser support

The latest versions of Chrome, Firefox, Safari, and Edge are [supported](https://vite.dev/guide/build.html#browser-compatibility).
