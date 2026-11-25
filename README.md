# EventCalendar [![](https://data.jsdelivr.com/v1/package/npm/@event-calendar/build/badge)](https://www.jsdelivr.com/package/npm/@event-calendar/build) [![npm](https://img.shields.io/npm/dm/@event-calendar/core?color=red&label=npm&style=flat-square)](https://www.npmjs.com/package/@event-calendar/core)

See [demo](https://vkurko.github.io/calendar/) and [changelog](CHANGELOG.md).

Full-sized drag & drop JavaScript event calendar with resource & timeline views:

* Lightweight (39kb [br](https://en.wikipedia.org/wiki/Brotli) compressed)
* Minimal DOM structure (thanks to [CSS Grid](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout))
* Zero-dependency (standalone bundle)
* Used on over 70,000 websites with [Bookly](https://wordpress.org/plugins/bookly-responsive-appointment-booking-tool/)

Inspired by [FullCalendar](https://fullcalendar.io/), it implements similar options.

### Featured sponsors

<table>
<tr>
<td>

[![@ekwi-tech](https://avatars.githubusercontent.com/u/146312349?s=52&v=4)](https://github.com/ekwi-tech)
</td>
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
    - [Content snippets](#content-snippets)
  - [React component](#react-component)
    - [Rendering content with React](#rendering-content-with-react)
    - [Calling methods in React](#calling-methods-in-react)
  - [Vue component](#vue-component)
    - [Rendering content with slots](#rendering-content-with-slots)
    - [Calling methods in Vue](#calling-methods-in-vue)
  - [Angular component](#angular-component)
    - [Rendering content with templates](#rendering-content-with-templates)
    - [Calling methods in Angular](#calling-methods-in-angular)
  - [Standalone bundle](#standalone-bundle)
  - [Modifying options after initialization](#modifying-options-after-initialization)
- [Options](#options)
  <table>
  <tr><td>

  - [allDayContent](#alldaycontent)
  - [allDaySlot](#alldayslot)
  - [buttonText](#buttontext)
  - [columnWidth](#columnwidth)
  - [customButtons](#custombuttons)
  - [customScrollbars](#customscrollbars)
  - [date](#date)
  - [dateClick](#dateclick)
  - [dateIncrement](#dateincrement)
  - [datesAboveResources](#datesaboveresources)
  - [datesSet](#datesset)
  - [dayCellContent](#daycellcontent)
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
  - [eventDurationEditable](#eventdurationeditable)
  </td><td>

  - [eventFilter](#eventfilter)
  - [eventGap](#eventgap)
  - [eventLongPressDelay](#eventlongpressdelay)
  - [eventMouseEnter](#eventmouseenter)
  - [eventMouseLeave](#eventmouseleave)
  - [eventOrder](#eventorder)
  - [eventOrderStrict](#eventorderstrict)
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
  - [icons](#icons)
  - [lazyFetching](#lazyfetching)
  - [listDayFormat](#listdayformat)
  - [listDaySideFormat](#listdaysideformat)
  - [loading](#loading)
  - [locale](#locale)
  - [longPressDelay](#longpressdelay)
  - [monthHeaderFormat](#monthheaderformat)
  - [moreLinkContent](#morelinkcontent)
  - [noEventsClick](#noeventsclick)
  - [noEventsContent](#noeventscontent)
  - [nowIndicator](#nowindicator)
  </td><td>

  - [pointer](#pointer)
  - [refetchResourcesOnNavigate](#refetchresourcesonnavigate)
  - [resizeConstraint](#resizeconstraint)
  - [resourceExpand](#resourceexpand)
  - [resources](#resources)
  - [resourcesInitiallyExpanded](#resourcesinitiallyexpanded)
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
  - [snapDuration](#snapduration)
  - [theme](#theme)
  - [timeZone](#timezone)
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
  - [setOptions](#setoptions-options-)
  </td><td>

  - [addEvent](#addevent-event-)
  - [getEventById](#geteventbyid-id-)
  - [getEvents](#getevents)
  - [removeEventById](#removeeventbyid-id-)
  - [updateEvent](#updateevent-event-)
  </td><td>

  - [refetchEvents](#refetchevents)
  - [refetchResources](#refetchresources)
  </td><td>

  - [dateFromPoint](#datefrompoint-x-y-)
  - [getView](#getview)
  - [gotoDate](#gotodate-date-)
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

#### Content snippets
The options that define content can also be given as Svelte snippets:

* [allDayContent](#alldaycontent)
* [dayCellContent](#daycellcontent)
* [eventContent](#eventcontent)
* [moreLinkContent](#morelinkcontent)
* [noEventsContent](#noeventscontent)
* [resourceLabelContent](#resourcelabelcontent)
* [weekNumberContent](#weeknumbercontent)

A snippet is passed to the `Calendar` component under the name of the option it defines:
```html
<Calendar plugins={[DayGrid]} {options}>
    {#snippet eventContent({event, timeText})}
        <b>{timeText}</b> {event.title}
    {/snippet}
</Calendar>
```
It can also be passed as a property, which is convenient when the snippet is declared elsewhere:
```html
<Calendar plugins={[DayGrid]} {options} eventContent={myEventContent}/>
```
A snippet receives the same argument as the function form of the option and is rendered in the same place.

The `content` property of [customButtons](#custombuttons) is also supported, but since custom buttons have arbitrary names, such a snippet is named `customButton` followed by the name of the button with the first letter capitalized. The button itself does not have to be listed in the `customButtons` option:
```html
<Calendar plugins={[ResourceTimeline]} options={{headerToolbar: {end: 'myFilter'}}}>
    {#snippet customButtonMyFilter()}
        <input bind:value={query}>
    {/snippet}
</Calendar>
```

Unlike a function, a snippet is rendered by Svelte itself. It can contain components, event handlers and transitions, and it is updated reactively when the state it uses changes.

If both a snippet and an option with the same name are given, the snippet takes precedence.

### React component
The first step is to install the EventCalendar `react` package:
```bash
npm install --save-dev @event-calendar/react
```
This package provides the `EventCalendar` component, as well as plugins for various views. You must use at least one plugin that provides a view. The following plugins are currently available:

* `DayGrid`
* `List`
* `ResourceTimeline`
* `ResourceTimeGrid`
* `TimeGrid`
* `Interaction` (doesn't provide a view)

Then in your React component, use the calendar like this:
```jsx
import {useState} from 'react';
import {EventCalendar, TimeGrid} from '@event-calendar/react';
import '@event-calendar/react/index.css';

const plugins = [TimeGrid];

export default function App() {
    const [events, setEvents] = useState([
        // your list of events
    ]);

    return (
        <EventCalendar
            plugins={plugins}
            view="timeGridWeek"
            events={events}
            eventClick={({event}) => console.log(event.id)}
        />
    );
}
```
All [options](#options) are passed as props, and the calendar is updated when they change. Objects, arrays and callbacks can be written right in JSX, there is no need for `useMemo` and `useCallback`. The `className`, `style` and `id` props are set on the element that wraps the calendar.

The calendar is destroyed gracefully when the component containing it is destroyed.

#### Rendering content with React
The following options accept JSX or a function that returns JSX:

* [allDayContent](#alldaycontent)
* [dayCellContent](#daycellcontent)
* [eventContent](#eventcontent)
* [moreLinkContent](#morelinkcontent)
* [noEventsContent](#noeventscontent)
* [resourceLabelContent](#resourcelabelcontent)
* [weekNumberContent](#weeknumbercontent)
* the `content` property of [customButtons](#custombuttons)

```jsx
<EventCalendar
    plugins={plugins}
    eventContent={({event, timeText}) => <EventBody event={event} time={timeText}/>}
    noEventsContent={<i>No events</i>}
    headerToolbar={{start: 'title', center: '', end: 'filter today prev,next'}}
    customButtons={{filter: {content: <input value={query} onChange={e => setQuery(e.target.value)}/>}}}
/>
```
The argument of the function is described in the documentation of each option. If the function returns `null` or `undefined`, the default content is shown.

#### Calling methods in React
The [methods](#methods) of the calendar are available through the `ref`:
```jsx
const calendar = useRef(null);

<EventCalendar ref={calendar} plugins={plugins}/>
<button onClick={() => calendar.current.next()}>Next</button>
```

### Vue component
The first step is to install the EventCalendar `vue` package:
```bash
npm install --save-dev @event-calendar/vue
```
This package provides the `EventCalendar` component, as well as plugins for various views. You must use at least one plugin that provides a view. The following plugins are currently available:

* `DayGrid`
* `List`
* `ResourceTimeline`
* `ResourceTimeGrid`
* `TimeGrid`
* `Interaction` (doesn't provide a view)

Then in your Vue component, use the calendar like this:
```html
<script setup>
import {ref} from 'vue';
import {EventCalendar, TimeGrid} from '@event-calendar/vue';
import '@event-calendar/vue/index.css';

const plugins = [TimeGrid];
const events = ref([
    // your list of events
]);
</script>

<template>
    <EventCalendar
        :plugins="plugins"
        view="timeGridWeek"
        :events="events"
        @event-click="({event}) => console.log(event.id)"
    />
</template>
```
All [options](#options) are passed as props, and the calendar is updated when they change, including the changes inside reactive objects and arrays, such as `events.value.push(event)`. The callbacks can also be used as event listeners. The `class`, `style` and `id` attributes are set on the element that wraps the calendar.

The calendar is destroyed gracefully when the component containing it is destroyed.

#### Rendering content with slots
The following options can be given as slots:

* [allDayContent](#alldaycontent)
* [dayCellContent](#daycellcontent)
* [eventContent](#eventcontent)
* [moreLinkContent](#morelinkcontent)
* [noEventsContent](#noeventscontent)
* [resourceLabelContent](#resourcelabelcontent)
* [weekNumberContent](#weeknumbercontent)
* the `content` property of [customButtons](#custombuttons): the slot is named `customButton` followed by the name of the button with the first letter capitalized

```html
<EventCalendar :plugins="plugins" :header-toolbar="{start: 'title', center: '', end: 'filter today prev,next'}">
    <template #eventContent="{event, timeText}">
        <EventBody :event="event" :time="timeText"/>
    </template>
    <template #customButtonFilter>
        <input v-model="query">
    </template>
</EventCalendar>
```
The slot props are described in the documentation of each option, as the argument of its function.

#### Calling methods in Vue
The [methods](#methods) of the calendar are available through the template ref:
```html
<script setup>
import {useTemplateRef} from 'vue';

const calendar = useTemplateRef('calendar');
</script>

<template>
    <EventCalendar ref="calendar" :plugins="plugins"/>
    <button @click="calendar.next()">Next</button>
</template>
```

### Angular component
The first step is to install the EventCalendar `angular` package:
```bash
npm install --save-dev @event-calendar/angular
```
This package provides the `EventCalendar` component and the `EcContent` directive, as well as plugins for various views. You must use at least one plugin that provides a view. The following plugins are currently available:

* `DayGrid`
* `List`
* `ResourceTimeline`
* `ResourceTimeGrid`
* `TimeGrid`
* `Interaction` (doesn't provide a view)

Then in your Angular component, use the calendar like this:
```ts
import {Component, signal} from '@angular/core';
import {EventCalendar, EcContent, TimeGrid, type Calendar} from '@event-calendar/angular';

@Component({
    selector: 'app-root',
    imports: [EventCalendar, EcContent],
    template: `<event-calendar [plugins]="plugins" [options]="options()"/>`
})
export class App {
    plugins = [TimeGrid];
    options = signal<Calendar.Options>({
        view: 'timeGridWeek',
        events: [
            // your list of events
        ]
    });
}
```
And import the styles in the global stylesheet of your application:
```css
@import '@event-calendar/angular/index.css';
```
All [options](#options) are passed as one object. To change them, pass a new object: the calendar is updated with the options that are different in it.

The calendar is destroyed gracefully when the component containing it is destroyed.

#### Rendering content with templates
The following options can be given as templates with the `ecContent` directive:

* [allDayContent](#alldaycontent)
* [dayCellContent](#daycellcontent)
* [eventContent](#eventcontent)
* [moreLinkContent](#morelinkcontent)
* [noEventsContent](#noeventscontent)
* [resourceLabelContent](#resourcelabelcontent)
* [weekNumberContent](#weeknumbercontent)
* the `content` property of [customButtons](#custombuttons): the template is named `customButton` followed by the name of the button with the first letter capitalized

```html
<event-calendar [plugins]="plugins" [options]="options()">
    <ng-template ecContent="eventContent" let-event="event" let-timeText="timeText">
        <app-event-body [event]="event" [time]="timeText"/>
    </ng-template>
    <ng-template ecContent="customButtonFilter">
        <input [(ngModel)]="query">
    </ng-template>
</event-calendar>
```
The variables of the template are described in the documentation of each option, as the argument of its function.

#### Calling methods in Angular
The [methods](#methods) of the calendar are the methods of the component:
```html
<event-calendar #calendar [plugins]="plugins" [options]="options()"/>
<button (click)="calendar.next()">Next</button>
```

### Standalone bundle
This bundle contains a version of the calendar that includes all plugins and is prepared for use in the browser via the `<script>` tag.

The first step is to include the following lines of code in the `<head>` section of your page:
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@event-calendar/build@5.22.0/dist/event-calendar.min.css">
<script src="https://cdn.jsdelivr.net/npm/@event-calendar/build@5.22.0/dist/event-calendar.min.js"></script>
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
You can modify the calendar options after initialization using the [setOption](#setoption-name-value-) method, or the [setOptions](#setoptions-options-) method to set several options at once.
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

The title of the all-day row.

The value is a [Content](#content), or a function that returns it:

```js
let options = {
    allDayContent: ({text}) => ({html: `<i>${text}</i>`})
};
```
The function receives an object with the following properties:
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

In Svelte, React, Vue and Angular this content can be rendered by the framework itself: with a [snippet](#content-snippets), [JSX](#rendering-content-with-react), a [slot](#rendering-content-with-slots) or a [template](#rendering-content-with-templates).

### allDaySlot
- Type `boolean`
- Default `true`

Shows the all-day row at the top of the `timeGrid` and `resourceTimeGrid` views.

```js
let options = {
    allDaySlot: false
};
```
Without the row there is no place for all-day events in these views, so they are not shown.

### buttonText
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

### columnWidth
- Type `string`
- Default `undefined`

The width of the day columns in the `timeGrid` and `resourceTimeGrid` views, and in the `resourceTimeline` views whose slots are days, such as `resourceTimelineMonth`.

By default the columns share the width of the calendar. With this option each column gets the given width, and the calendar is scrolled horizontally when the columns do not fit.

The value is a CSS [length](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/grid-template-columns#values), so include the unit:

```js
let options = {
    columnWidth: '150px'
};
```

### customButtons
- Type `object` or `function`
- Default `{}`

Your own buttons and other items for the [headerToolbar](#headertoolbar).

Define the items under any names, then put the names into `headerToolbar`:

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
An item accepts the following properties:
<table>
<tr>
<td>

`text`
</td>
<td>

The text to be displayed on the button itself. See [Content](#content)
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
<tr>
<td>

`content`
</td>
<td>

Arbitrary content displayed in place of the button. See [Content](#content)

This value can be either a [Content](#content) or a function that returns content:

```js
function () {
  // return Content
}
```
</td>
</tr>
</table>

An item with `content` is rendered as a `<div>` instead of a `<button>`, so it can hold any widget, such as an input or a select. It needs neither `text` nor `click`, and if both `content` and `text` are given, `content` is used.

```js
let input = document.createElement('input');

let options = {
    customButtons: {
        myFilter: {
            content: {domNodes: [input]}
        }
    },
    headerToolbar: {
        start: 'prev,next today',
        center: 'title',
        end: 'myFilter'
    }
};
```
In Svelte, React, Vue and Angular this content can be rendered by the framework itself: with a [snippet](#content-snippets), [JSX](#rendering-content-with-react), a [slot](#rendering-content-with-slots) or a [template](#rendering-content-with-templates).

The option can also be a function that receives the default items and returns the new ones:

```js
let options = {
    customButtons: buttons => ({...buttons, myCustomButton: {text: 'custom!', click: () => alert('clicked!')}})
};
```

### customScrollbars
- Type `boolean`
- Default `false`

Styles the scrollbars of the calendar, which also keeps them always visible in the browsers that [support](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::-webkit-scrollbar#browser_compatibility) it.

It is useful on macOS, where the scrollbars are hidden until you scroll: in a `resourceTimeline` view nothing would tell the user that the calendar can be scrolled horizontally.

```js
let options = {
    customScrollbars: true
};
```

### date
- Type `Date`, `string` or `undefined`
- Default `undefined`

The date the calendar shows. The view displays the period that contains this date: its week, its month and so on.

The value is a JavaScript Date object or an ISO8601 date string. Without a value it is today in the calendar's [timeZone](#timezone).

```js
let options = {
    date: '2026-12-31'
};
```
The option follows the navigation, so [getOption](#getoption-name-)`('date')` returns the date that is shown at the moment.

### dateClick
- Type `function`
- Default `undefined`
- Requires `Interaction` plugin

Called when the user clicks a day or a time slot.

```js
let options = {
    dateClick: ({date, allDay, resource}) => {
        console.log(date, allDay, resource?.title);
    }
};
```
The function receives an object with the following properties:
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

### dateIncrement
- Type `string`, `integer` or `object`
- Default `undefined`

How far the calendar moves when the prev and next buttons are clicked, or the [prev()](#prev) and [next()](#next) methods are called. By default it moves by the whole view, that is by its [duration](#duration).

The value is anything that can be [parsed into a Duration](#parsing-duration-from-input-values) object.

```js
let options = {
    view: 'timeGridWeek',
    // Show a week, but move two weeks at a time
    dateIncrement: {weeks: 2}
};
```

### datesAboveResources
- Type `boolean`
- Default `false`

Puts the days above the resources in the `resourceTimeGrid` views: the columns are grouped by day, and each day holds a column per resource.

By default it is the other way around: the columns are grouped by resource, and each resource holds its days.

```js
let options = {
    view: 'resourceTimeGridWeek',
    datesAboveResources: true
};
```

### datesSet
- Type `function`
- Default `undefined`

Called when the period the calendar shows is set or changed: when the calendar is created and each time it moves to other dates, by navigation or by switching to a view of another period.

```js
let options = {
    datesSet: ({start, end, view}) => {
        console.log(view.type, start, end);
    }
};
```
The function receives an object with the following properties:
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

### dayCellContent
- Type `Content` or `function`
- Default `undefined`

The content of the day cells. In the `dayGrid` views it replaces the number of the day and in the `list` views the name of the day. In the other views the cells have no content by default.

The value is a [Content](#content), or a function that returns it:

```js
let options = {
    dayCellContent: ({date, isToday}) => ({html: isToday ? '<b>Today</b>' : String(date.getDate())})
};
```
The function receives an object with the following properties:
<table>
<tr>
<td>

`allDay`
</td>
<td>

`true` or `false`. Determines if the cell is within `all-day` slot. Month and list views are also considered as all-day slots
</td>
</tr>
<tr>
<td>

`date`
</td>
<td>JavaScript Date object corresponding to the day</td>
</tr>
<tr>
<td>

`isToday`
</td>
<td>

`true` or `false`. Determines if the cell is for today
</td>
</tr>
<tr>
<td>

`resource`
</td>
<td>

If the current view is a resource view, the [Resource](#resource-object) object that owns this cell
</td>
</tr>
</table>

In Svelte, React, Vue and Angular this content can be rendered by the framework itself: with a [snippet](#content-snippets), [JSX](#rendering-content-with-react), a [slot](#rendering-content-with-slots) or a [template](#rendering-content-with-templates).

### dayCellFormat
- Type `object` or `function`
- Default `{day: 'numeric'}`

The format of the day number in the cells of the `dayGrid` views.

The value is an object with the options of the native JavaScript [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat) object, or a function that returns the formatted [Content](#content).

```js
let options = {
    dayCellFormat: {day: '2-digit'}
    // or as a function
    // dayCellFormat: date => String(date.getDate())
};
```
The function receives the JavaScript Date object to format.

### dayHeaderAriaLabelFormat
- Type `object` or `function`
- Default `{dateStyle: 'full'}`
> Views override the default value as follows:
> - dayGridMonth `{weekday: 'long'}`

The format of the `aria-label` attribute of the column headings, which is what screen readers announce instead of the short visible text.

The value is an object with the options of the native JavaScript [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat) object, or a function that returns the formatted string.

```js
let options = {
    dayHeaderAriaLabelFormat: {weekday: 'long', month: 'long', day: 'numeric'}
    // or as a function
    // dayHeaderAriaLabelFormat: date => date.toDateString()
};
```
The function receives the JavaScript Date object to format.

### dayHeaderFormat
- Type `object` or `function`
- Default `{weekday: 'short', month: 'numeric', day: 'numeric'}`
> Views override the default value as follows:
> - dayGridDay `{weekday: 'long'}`
> - dayGridMonth `{weekday: 'short'}`
> - resourceTimeGridDay `{weekday: 'long'}`
> - resourceTimelineDay `{weekday: 'long'}`
> - resourceTimelineMonth `{weekday: 'short', day: 'numeric'}`
> - resourceTimelineYear `{weekday: 'short', day: 'numeric'}`
> - timeGridDay `{weekday: 'long'}`

The format of the column headings.

The value is an object with the options of the native JavaScript [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat) object, or a function that returns the formatted [Content](#content).

```js
let options = {
    dayHeaderFormat: {weekday: 'long'}
    // or as a function
    // dayHeaderFormat: date => date.toDateString()
};
```
The function receives the JavaScript Date object to format.

### dayMaxEvents
- Type `boolean`
- Default `false`

Limits the events of a day in the `dayGrid` views to those that fit into the height of the day cell. The rest are collected under a link like `+2 more`, which opens them in a popup.

It needs the calendar to have a [height](#height): without one, as well as without this option, the rows of the grid grow to show all the events.

```js
let options = {
    view: 'dayGridMonth',
    height: '600px',
    dayMaxEvents: true
};
```
Only `true` is supported: the limit is set by the height of the cell, not by a number.

### dayPopoverFormat
- Type `object` or `function`
- Default `{month: 'long', day: 'numeric', year: 'numeric'}`

The format of the date in the title of the popup that the `+more` link opens, see [dayMaxEvents](#daymaxevents).

The value is an object with the options of the native JavaScript [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat) object, or a function that returns the formatted [Content](#content).

```js
let options = {
    dayPopoverFormat: {weekday: 'long', month: 'long', day: 'numeric'}
    // or as a function
    // dayPopoverFormat: date => date.toDateString()
};
```
The function receives the JavaScript Date object to format.

### displayEventEnd
- Type `boolean`
- Default `true`
> Views override the default value as follows:
> - dayGridDay `false`
> - dayGridMonth `false`
> - dayGridWeek `false`
> - resourceTimelineDay `false`
> - resourceTimelineMonth `false`
> - resourceTimelineWeek `false`
> - resourceTimelineYear `false`

Shows the end time of an event next to its start time: `10:00 - 11:30` instead of `10:00`.

```js
let options = {
    displayEventEnd: false
};
```

### dragConstraint
- Type `function`
- Default `undefined`
- Requires `Interaction` plugin

Limits where an event can be dragged.

The function is called on every move of the pointer while an event is dragged. It receives the same argument as [eventDrop](#eventdrop), with the event as it would be at the new position, and returns `false` to forbid dropping the event there.

```js
let options = {
    // No events on the weekend
    dragConstraint: ({event}) => ![0, 6].includes(event.start.getDay())
};
```
While the position is not allowed, the event stays at the last allowed position and the cursor changes to `not-allowed`. Releasing the pointer there cancels the dragging.

### dragScroll
- Type `boolean`
- Default `true`
- Requires `Interaction` plugin

Scrolls the calendar when an event is dragged to its edge, so that the event can be moved to a time that is not visible.

```js
let options = {
    dragScroll: false
};
```

### duration
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

The value is anything that can be [parsed into a Duration](#parsing-duration-from-input-values) object.

```js
let options = {
    view: 'timeGridWeek',
    // Four days instead of a week
    duration: {days: 4}
};
```
Usually it is set for a view of your own in the [views](#views) option.

### editable
- Type `boolean`
- Default `false`
- Requires `Interaction` plugin

Lets the user drag and resize the events, where the more specific options do not decide it.

Dragging is controlled by [eventStartEditable](#eventstarteditable) and resizing by [eventDurationEditable](#eventdurationeditable). Both are `true` by default, so with the `Interaction` plugin the events can be dragged and resized even while `editable` is `false`. This option is used for the action whose own option is set to `null`:

```js
let options = {
    // Both dragging and resizing are decided by `editable`
    eventStartEditable: null,
    eventDurationEditable: null,
    editable: true
};
```
For each event the first value that is set is taken, in this order: the `startEditable` (or `durationEditable`) property of the event, the `eventStartEditable` (or `eventDurationEditable`) option, the `editable` property of the event, and this option.

### events
- Type `array`
- Default `[]`

The events of the calendar: an array of plain objects that are [parsed](#parsing-event-from-a-plain-object) into [Event](#event-object) objects.

```js
let options = {
    events: [
        {id: 1, title: 'Meeting', start: '2026-12-01 10:00', end: '2026-12-01 11:30'},
        {id: 2, title: 'Conference', start: '2026-12-02', end: '2026-12-04', allDay: true}
    ]
};
```
To load the events from a server, use [eventSources](#eventsources) instead. If `eventSources` is given, this option is not used.

### eventAllUpdated
- Type `function`
- Default `undefined`

Called when the calendar has finished rendering the events after they change: when they are loaded, added, changed or removed, and when the view is switched.

```js
let options = {
    eventAllUpdated: ({view}) => {
        console.log('The events are rendered in', view.type);
    }
};
```
The function receives an object with the following properties:
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

This is an experimental feature, and its behavior may change in the future.

### eventBackgroundColor
- Type `string`
- Default `undefined`

The default background color of the events.

The value is any CSS color, such as `'#f00'`, `'rgb(255,0,0)'` or `'red'`:

```js
let options = {
    eventBackgroundColor: '#0ea5e9'
};
```
The color of a [resource](#resource-object) and the color of the [event](#event-object) itself take precedence over this option.

### eventClassNames
- Type `string`, `array` or `function`
- Default `undefined`

Additional CSS classes for the elements of the events.

The value is a string with the class names, an array of them, or a function that returns either:

```js
let options = {
    eventClassNames: ({event}) => event.extendedProps.urgent ? ['urgent', 'bold'] : 'regular'
};
```
The function receives an object with the following properties:
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

Called when the user clicks an event, or presses Enter or Space on a focused one.

```js
let options = {
    eventClick: ({event, el}) => {
        console.log(event.id, el);
    }
};
```
The function receives an object with the following properties:
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

With this option the events become buttons for the keyboard and screen readers: they can be focused and activated.

### eventColor
- Type `string`
- Default `undefined`

An alias for [eventBackgroundColor](#eventbackgroundcolor). It is used when `eventBackgroundColor` is not set.

```js
let options = {
    eventColor: '#0ea5e9'
};
```

### eventContent
- Type `Content` or `function`
- Default `undefined`

The content of an event, in place of the default time and title.

The value is a [Content](#content), or a function that returns it:

```js
let options = {
    eventContent: ({event, timeText}) => ({
        html: `<div class="ec-event-time">${timeText}</div><div class="ec-event-title">★ ${event.title}</div>`
    })
};
```
The function receives an object with the following properties:
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

If the function returns `undefined`, the event gets the default content, so the content can be changed for some events only.

The event itself does not clip its content: the default time and title are clipped by their own `ec-event-time` and `ec-event-title` classes. Use the same classes for your content, as in the example, so that it does not stick out of an event that is too small for it.

In Svelte, React, Vue and Angular this content can be rendered by the framework itself: with a [snippet](#content-snippets), [JSX](#rendering-content-with-react), a [slot](#rendering-content-with-slots) or a [template](#rendering-content-with-templates).

### eventDidMount
- Type `function`
- Default `undefined`

Called right after the element of an event is added to the page. This is the place to attach something to the element: a tooltip, for example.

```js
let options = {
    eventDidMount: ({event, el}) => {
        el.title = event.title;
    }
};
```
The function receives an object with the following properties:
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

It is called once for each element. An element is created again, and the function is called again, when the event is replaced with [updateEvent()](#updateevent-event-), loaded again, or moved to another day or resource.

### eventDragMinDistance
- Type `integer`
- Default `5`
- Requires `Interaction` plugin

How many pixels the pointer has to move before an event starts to be dragged. It keeps a click with a slightly moved mouse from being taken as dragging.

```js
let options = {
    eventDragMinDistance: 10
};
```

### eventDragStart
- Type `function`
- Default `undefined`
- Requires `Interaction` plugin

Called when the user starts dragging an event.

```js
let options = {
    eventDragStart: ({event}) => {
        console.log('Dragging', event.title);
    }
};
```
The function receives an object with the following properties:
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

Called when the user stops dragging an event, wherever it is released.

```js
let options = {
    eventDragStop: ({event}) => {
        console.log('Released', event.title);
    }
};
```
The function receives an object with the following properties:
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

At this moment the event is not changed yet. Unless the drop is refused, the event is changed after this call, and then [eventDrop](#eventdrop) is called.

### eventDrop
- Type `function`
- Default `undefined`
- Requires `Interaction` plugin

Called when the user has dropped an event and the drop is accepted. The event is already changed at this moment. It is called even if the event is dropped where it was.

```js
let options = {
    eventDrop: async ({event, oldEvent, revert}) => {
        let saved = await save(event.id, event.start, event.end);
        if (!saved) {
            // Put the event back
            revert();
        }
    }
};
```
The function receives an object with the following properties:
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

It is called after [eventDragStop](#eventdragstop).

### eventDurationEditable
- Type `boolean`
- Default `true`
- Requires `Interaction` plugin

Lets the user resize the events. Set it to `false` to forbid resizing:

```js
let options = {
    eventDurationEditable: false
};
```
An event can override it with its own `durationEditable` property. With `null`, the [editable](#editable) option decides.

### eventFilter
- Type `function`
- Default `undefined`

Decides which events are shown, without changing the events themselves. The function is called for each event and returns `true` to show it:

```js
let options = {
    // Only the events of the selected category
    eventFilter: ({event}) => event.extendedProps.category === 'work'
};
```
The function receives an object with the following properties:
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

The filter is applied again when the view changes, so the events can be different in each view.

### eventGap
- Type `integer`
- Default `1`

The vertical gap in pixels between the events that are stacked one under another: in the `dayGrid` views, in the all-day row of the `timeGrid` and `resourceTimeGrid` views, and in the `resourceTimeline` views.

```js
let options = {
    eventGap: 4
};
```

### eventLongPressDelay
- Type `integer`
- Default `undefined`
- Requires `Interaction` plugin

On touch devices, how many milliseconds the user has to hold a finger on an event before it can be dragged or resized. A shorter touch scrolls the calendar.

```js
let options = {
    eventLongPressDelay: 500
};
```
Without a value, [longPressDelay](#longpressdelay) is used.

### eventMouseEnter
- Type `function`
- Default `undefined`

Called when the mouse pointer enters an event.

```js
let options = {
    eventMouseEnter: ({event, el}) => {
        showTooltip(el, event.title);
    }
};
```
The function receives an object with the following properties:
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

Called when the mouse pointer leaves an event.

```js
let options = {
    eventMouseLeave: ({event, el}) => {
        hideTooltip(el);
    }
};
```
The function receives an object with the following properties:
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

### eventOrder
- Type `function`
- Default `undefined`

The order of the events that are shown at the same place: which one is higher in a day of the month view, or to the left in a time slot.

The value is a function that compares two [Event](#event-object) objects, like the function of `Array.sort()`: it returns a negative number if the first event comes before the second, a positive one if it comes after, and zero if they are equal.

```js
let options = {
    // By title
    eventOrder: (a, b) => a.title.localeCompare(b.title)
};
```
By default the events are ordered by their start time, and of the events that start at the same time the all-day ones come first.

### eventOrderStrict
- Type `boolean`
- Default `false`

Makes the `resourceTimeline` views keep the order of the events vertically, even if it takes more space.

By default the layout is compact: an event is placed into the topmost free line, so it can end up above an event that comes before it in the order, when there is free space above that one. With `true`, an event is never placed above another event that comes before it in [eventOrder](#eventorder) and overlaps it.

```js
let options = {
    eventOrderStrict: true
};
```
It is useful when a parent event has to stay above its children: order them so that the parent comes first, and enable this option.

The events that do not overlap are still laid out independently. To keep related events on the same line, give them the same `layoutGroup`.

### eventResizableFromStart
- Type `boolean`
- Default `false`
- Requires `Interaction` plugin

Lets the user resize an event from its start as well: by the top edge in the time grid, and by the left edge in the other views.

```js
let options = {
    editable: true,
    eventResizableFromStart: true
};
```

### eventResize
- Type `function`
- Default `undefined`
- Requires `Interaction` plugin

Called when the user has finished resizing an event and the new size is accepted. The event is already changed at this moment.

```js
let options = {
    eventResize: async ({event, revert}) => {
        let saved = await save(event.id, event.start, event.end);
        if (!saved) {
            // Put the event back
            revert();
        }
    }
};
```
The function receives an object with the following properties:
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

It is called after [eventResizeStop](#eventresizestop).

### eventResizeStart
- Type `function`
- Default `undefined`
- Requires `Interaction` plugin

Called when the user starts resizing an event.

```js
let options = {
    eventResizeStart: ({event}) => {
        console.log('Resizing', event.title);
    }
};
```
The function receives an object with the following properties:
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

Called when the user stops resizing an event.

```js
let options = {
    eventResizeStop: ({event}) => {
        console.log('Released', event.title);
    }
};
```
The function receives an object with the following properties:
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

At this moment the event is not changed yet. Unless the new size is refused, the event is changed after this call, and then [eventResize](#eventresize) is called.

### eventSources
- Type `EventSource[]`
- Default `[]`

The sources the calendar loads its events from: URLs or functions. The events are requested for the period the calendar shows, and again when it moves outside of the loaded period, see [lazyFetching](#lazyfetching).

```js
let options = {
    eventSources: [
        // The calendar requests /events?start=...&end=...
        {url: '/events'},
        // Or loads them with your function
        {events: async ({startStr, endStr}) => (await fetch(`/api/events?from=${startStr}&to=${endStr}`)).json()}
    ]
};
```
If this option is given, the [events](#events) option is not used. The start and the end of the loading are reported to the [loading](#loading) callback.

A source is an object with one of the following sets of properties:

#### 1. Fetch events from a URL
<table>
<tr>
<td>

`url`
</td>
<td>

A URL from which the calendar will fetch an array of [parsable](#parsing-event-from-a-plain-object) [Event](#event-object) objects in JSON format. HTTP requests with the following parameters will be sent to this URL whenever the calendar needs new event data:
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
<tr>
<td>

`timeZone`
</td>
<td>
The value of the calendar's [timeZone](#timezone) option. Sent only when `timeZone` is not `'local'`
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
<tr>
<td>

`timeZone`
</td>
<td>The value of the calendar's [timeZone](#timezone) option</td>
</tr>
</table>

The `successCallback` function must be called by the custom function with an array of [parsable](#parsing-event-from-a-plain-object) [Event](#event-object) objects.

If there is any failure (e.g., if an AJAX request fails), then call the `failureCallback` instead. It accepts an argument with information about the failure.

Instead of calling `successCallback` and `failureCallback`, you may return the resulting array of events or return a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) (or [thenable](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/resolve)) object instead.
</td>
</tr>
</table>

### eventStartEditable
- Type `boolean`
- Default `true`
- Requires `Interaction` plugin

Lets the user drag the events. Set it to `false` to forbid dragging:

```js
let options = {
    eventStartEditable: false
};
```
An event can override it with its own `startEditable` property. With `null`, the [editable](#editable) option decides.

### eventTimeFormat
- Type `object` or `function`
- Default `{hour: 'numeric', minute: '2-digit'}`

The format of the time shown on an event.

The value is an object with the options of the native JavaScript [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat) object, or a function that returns the formatted [Content](#content).

```js
let options = {
    eventTimeFormat: {hour: '2-digit', minute: '2-digit', hour12: false}
    // or as a function
    // eventTimeFormat: (start, end) => start.toLocaleTimeString()
};
```
The function receives the following arguments:
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
<td>JavaScript Date object containing the end of the time span to be formatted, or `null` if the end time is not displayed (see [displayEventEnd](#displayeventend))</td>
</tr>
</table>

### eventTextColor
- Type `string`
- Default `undefined`

The default text color of the events. It is not used in the `list` views.

The value is any CSS color, such as `'#f00'`, `'rgb(255,0,0)'` or `'red'`:

```js
let options = {
    eventTextColor: '#fff'
};
```
The color of a [resource](#resource-object) and the color of the [event](#event-object) itself take precedence over this option.

### filterEventsWithResources
- Type `boolean`
- Default `false`

Hides the events that do not belong to any of the [resources](#resources) in the `dayGrid`, `timeGrid` and `list` views. These views do not show the resources themselves, so by default they show all the events.

```js
let options = {
    view: 'timeGridWeek',
    resources: [{id: 1, title: 'Room A'}],
    // Only the events of Room A are shown
    filterEventsWithResources: true
};
```

### filterResourcesWithEvents
- Type `boolean`
- Default `false`

Hides the resources that have no events in the period the resource view shows. Background events do not count.

```js
let options = {
    filterResourcesWithEvents: true
};
```

### firstDay
- Type `integer`
- Default `0`

The day the week starts on: `0` is Sunday, `1` is Monday, and so on up to `6`, Saturday.

```js
let options = {
    // The week starts on Monday
    firstDay: 1
};
```

### flexibleSlotTimeLimits
- Type `boolean` or `object`
- Default `false`

Extends [slotMinTime](#slotmintime) and [slotMaxTime](#slotmaxtime) automatically when an event of the shown period is outside of them, so that no event is cut off or hidden.

```js
let options = {
    slotMinTime: '09:00',
    slotMaxTime: '18:00',
    // An event at 7:30 makes the day start at 7:30
    flexibleSlotTimeLimits: true
};
```
With `true`, all the shown events are taken into account except the background ones. To decide it yourself, pass an object with the following properties instead:

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

```js
let options = {
    // Background events count as well
    flexibleSlotTimeLimits: {eventFilter: event => true}
};
```

### headerToolbar
- Type `object`
- Default `{start: 'title', center: '', end: 'today prev,next'}`

What the toolbar at the top of the calendar contains: the title and the buttons.

The value is an object with the `start`, `center` and `end` properties for the three parts of the toolbar. Each one is a string with the names of the items. The items separated by a comma are joined into a group, and the items separated by a space have a gap between them.

```js
let options = {
    headerToolbar: {
        start: 'prev,next today',
        center: 'title',
        end: 'dayGridMonth,timeGridWeek,timeGridDay'
    }
};
```
The following items are available, as well as the ones defined in [customButtons](#custombuttons):
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

The texts of the buttons are set with [buttonText](#buttontext).

### height
- Type `string`
- Default `undefined`

The height of the whole calendar. With a height the calendar scrolls inside itself, without one it is as tall as its content.

The value is any CSS height:

```js
let options = {
    height: '600px'
};
```
A percentage, like `'100%'`, works when the element that contains the calendar has a height itself.

### hiddenDays
- Type `array`
- Default `[]`

The days of the week that are not shown: `0` is Sunday, `1` is Monday, and so on up to `6`, Saturday.

```js
let options = {
    // Without the weekend
    hiddenDays: [0, 6]
};
```

### highlightedDates
- Type `array`
- Default `[]`

The dates that are highlighted in the calendar: holidays, for example.

Each date is an ISO8601 date string or a JavaScript Date object:

```js
let options = {
    highlightedDates: ['2026-12-25', '2026-12-26', new Date(2027, 0, 1)]
};
```

### icons
- Type `object`
- Default `{collapse: {html: '&minus;'}, expand: {html: '&plus;'}}`

The icons of the buttons that have no text: currently, the buttons that collapse and expand nested resources in the `resourceTimeline` views.

The value is an object where each icon is a [Content](#content), or a function that receives the default icons and returns the new ones:

```js
let options = {
    icons: icons => ({...icons, collapse: {html: '▾'}, expand: {html: '▸'}})
};
```
An object replaces the default icons completely, so it has to contain all of them.

### lazyFetching
- Type `boolean`
- Default `true`

Makes the calendar skip loading when the period it moves to is inside the period it has loaded last, which keeps the number of requests low.

For example, the calendar starts in the month view and loads the events of February. When the user switches to the week view and browses the weeks of February, nothing is loaded: the calendar already has these events.

```js
let options = {
    // Load the events again on every change of the period
    lazyFetching: false
};
```
With `false`, the events are loaded each time the shown period changes: on prev and next, for example.

The same applies to the resources when [refetchResourcesOnNavigate](#refetchresourcesonnavigate) is enabled.

### listDayFormat
- Type `object` or `function`
- Default `{weekday: 'long'}`

The format of the text on the left side of the day headings in the `list` views.

The value is an object with the options of the native JavaScript [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat) object, or a function that returns the formatted [Content](#content).

```js
let options = {
    listDayFormat: {weekday: 'short'}
    // or as a function
    // listDayFormat: date => date.toDateString()
};
```
The function receives the JavaScript Date object to format.

### listDaySideFormat
- Type `object` or `function`
- Default `{year: 'numeric', month: 'long', day: 'numeric'}`

The format of the text on the right side of the day headings in the `list` views.

The value is an object with the options of the native JavaScript [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat) object, or a function that returns the formatted [Content](#content).

```js
let options = {
    listDaySideFormat: {month: 'short', day: 'numeric'}
    // or as a function
    // listDaySideFormat: date => date.toDateString()
};
```
The function receives the JavaScript Date object to format.

### loading
- Type `function`
- Default `undefined`

Called when the calendar starts and when it finishes loading events or resources from their sources. It is the place to show and hide a spinner.

```js
let options = {
    loading: isLoading => {
        spinner.hidden = !isLoading;
    }
};
```
The function receives `true` when the loading starts, and `false` when it is done.

### locale
- Type `string`
- Default `undefined`

The language and the regional format of the dates and times in the calendar: of the title, the headings, the time of the events and so on.

The value is a locale for the native JavaScript [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#locales) object. Without a value the locale of the browser is used.

```js
let options = {
    locale: 'de'
};
```
Only the dates and times follow the locale. The texts of the buttons are set with [buttonText](#buttontext), the other texts, such as `all-day` and `No events`, with the content options, and the first day of the week with [firstDay](#firstday).

### longPressDelay
- Type `integer`
- Default `1000`

On touch devices, how many milliseconds the user has to hold a finger before an event can be dragged or resized, or a date range can be selected. A shorter touch scrolls the calendar.

```js
let options = {
    longPressDelay: 500
};
```
To set it separately for the events and for the selection, use [eventLongPressDelay](#eventlongpressdelay) and [selectLongPressDelay](#selectlongpressdelay).

### monthHeaderFormat
- Type `object` or `function`
- Default `{month: 'long'}`

The format of the month headings in the `resourceTimelineMonth` and `resourceTimelineYear` views.

The value is an object with the options of the native JavaScript [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat) object, or a function that returns the formatted [Content](#content).

```js
let options = {
    monthHeaderFormat: {month: 'short', year: 'numeric'}
    // or as a function
    // monthHeaderFormat: date => date.toDateString()
};
```
The function receives the JavaScript Date object to format.

The row of the month headings is hidden when the view shows exactly one whole month, since the month is already in the title of the calendar.

### moreLinkContent
- Type `Content` or `function`
- Default `undefined`

The content of the link that replaces the events that do not fit into a day, instead of the default `+2 more`. See [dayMaxEvents](#daymaxevents).

The value is a [Content](#content), or a function that returns it:

```js
let options = {
    moreLinkContent: ({num}) => `${num} hidden`
};
```
The function receives an object with the following properties:
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

In Svelte, React, Vue and Angular this content can be rendered by the framework itself: with a [snippet](#content-snippets), [JSX](#rendering-content-with-react), a [slot](#rendering-content-with-slots) or a [template](#rendering-content-with-templates).

### noEventsClick
- Type `function`
- Default `undefined`

Called when the user clicks the empty area of a `list` view that has no events to show.

```js
let options = {
    noEventsClick: ({view}) => {
        console.log('Nothing in', view.title);
    }
};
```
The function receives an object with the following properties:
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

What a `list` view shows when it has no events.

The value is a [Content](#content), or a function that returns it:

```js
let options = {
    noEventsContent: {html: '<i>Nothing is planned</i>'}
};
```
In Svelte, React, Vue and Angular this content can be rendered by the framework itself: with a [snippet](#content-snippets), [JSX](#rendering-content-with-react), a [slot](#rendering-content-with-slots) or a [template](#rendering-content-with-templates).

### nowIndicator
- Type `boolean`
- Default `false`

Shows a line at the current time in the `timeGrid`, `resourceTimeGrid` and `resourceTimeline` views. The timeline views whose slots are days, such as `resourceTimelineMonth`, do not show it.

```js
let options = {
    nowIndicator: true
};
```

### pointer
- Type `boolean`
- Default `false`
- Requires `Interaction` plugin

Highlights the time slot or the day under the mouse pointer, which shows where a click will land.

```js
let options = {
    pointer: true
};
```

### refetchResourcesOnNavigate
- Type `boolean`
- Default `false`

Loads the [resources](#resources) again when the calendar moves to another period, so that each period can have its own resources. By default the resources are loaded once.

```js
let options = {
    resources: {url: '/resources'},
    refetchResourcesOnNavigate: true
};
```
The request then contains the period the resources are needed for. Whether a period that is already loaded is requested again depends on [lazyFetching](#lazyfetching).

### resizeConstraint
- Type `function`
- Default `undefined`
- Requires `Interaction` plugin

Limits how an event can be resized.

The function is called on every move of the pointer while an event is resized. It receives the same argument as [eventResize](#eventresize), with the event as it would be with the new size, and returns `false` to forbid this size.

```js
let options = {
    // Not longer than 3 hours
    resizeConstraint: ({event}) => event.end - event.start <= 3 * 60 * 60 * 1000
};
```
While the size is not allowed, the event keeps the last allowed size and the cursor changes to `not-allowed`. Releasing the pointer there cancels the resizing.

### resourceExpand
- Type `function`
- Default `undefined`

Called when the user expands or collapses a resource with nested children in the `resourceTimeline` views.

```js
let options = {
    resourceExpand: ({resource}) => {
        console.log(resource.title, resource.expanded);
    }
};
```
The function receives an object with the following properties:
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

### resources
- Type `array`, `object` or `function`
- Default `[]`

The resources of the resource views: rooms, people, machines, or anything else the events belong to. An event refers to its resources with the `resourceId` or `resourceIds` property.

They can be given in one of three ways:

#### 1. Array of plain objects
If the resources are known in advance, pass them as an array of plain objects, which are [parsed](#parsing-resource-from-a-plain-object) into [Resource](#resource-object) objects:

```js
let options = {
    resources: [
        {id: 1, title: 'Room A'},
        {id: 2, title: 'Room B', children: [
            {id: 3, title: 'Room B1'}
        ]}
    ]
};
```

#### 2. Fetch resources from a URL
To load the resources from a server, pass an object with the following properties:
<table>
<tr>
<td>

`url`
</td>
<td>

A URL from which the calendar will fetch an array of [parsable](#parsing-resource-from-a-plain-object) [Resource](#resource-object) objects in JSON format. If [refetchResourcesOnNavigate](#refetchresourcesonnavigate) is enabled then HTTP requests with the following parameters will be sent to the URL whenever the user navigates to a different date:
<table>
<tr>
<td>

`start`
</td>
<td>
Start date of the range the calendar needs resources for
</td>
</tr>
<tr>
<td>

`end`
</td>
<td>
End date of the range the calendar needs resources for
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

```js
let options = {
    resources: {url: '/resources'}
};
```

#### 3. Execute custom function
The resources can also be provided by your own function:

```js
let options = {
    resources: async fetchInfo => (await fetch('/api/resources')).json()
};
```
The function receives `fetchInfo`, `successCallback` and `failureCallback`. If [refetchResourcesOnNavigate](#refetchresourcesonnavigate) is enabled, the function is called each time the calendar moves to another period, and `fetchInfo` is an object with the following properties. Otherwise it is an empty object.
<table>
<tr>
<td>

`start`
</td>
<td>JavaScript Date object for the beginning of the range the calendar needs resources for</td>
</tr>
<tr>
<td>

`end`
</td>
<td>JavaScript Date object for the end of the range the calendar needs resources for. Note: This value is exclusive</td>
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

`timeZone`
</td>
<td>The value of the calendar's [timeZone](#timezone) option</td>
</tr>
</table>

The function passes an array of [parsable](#parsing-resource-from-a-plain-object) [Resource](#resource-object) objects to `successCallback`, or the information about a failure to `failureCallback`. Instead of calling them, it can return the array or a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) (or a [thenable](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/resolve)) of it.

### resourcesInitiallyExpanded
- Type `boolean`
- Default `true`

Whether the resources with nested children are expanded or collapsed at first in the `resourceTimeline` views.

```js
let options = {
    // Start with all groups collapsed
    resourcesInitiallyExpanded: false
};
```
It applies to the resources that have no `expanded` property of their own and that the user has not expanded or collapsed yet.

### resourceLabelContent
- Type `string`, `object` or `function`
- Default `undefined`

The content of a resource label, in place of the title of the resource.

The value is a [Content](#content), or a function that returns it:

```js
let options = {
    resourceLabelContent: ({resource}) => ({html: `<b>${resource.title}</b>`})
};
```
The function receives an object with the following properties:
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

In Svelte, React, Vue and Angular this content can be rendered by the framework itself: with a [snippet](#content-snippets), [JSX](#rendering-content-with-react), a [slot](#rendering-content-with-slots) or a [template](#rendering-content-with-templates).

### resourceLabelDidMount
- Type `function`
- Default `undefined`

Called right after the element of a resource label is added to the page. This is the place to attach something to the element: a tooltip, for example.

```js
let options = {
    resourceLabelDidMount: ({resource, el}) => {
        el.title = resource.title;
    }
};
```
The function receives an object with the following properties:
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

It is called once for each element. The elements are created again, and the function is called again, when the resources are loaded again.

### scrollTime
- Type `string`, `integer` or `object`
- Default `'06:00:00'`

The time the calendar is scrolled to when it is shown and each time it moves to other dates, so that the working hours are visible without scrolling.

The value is anything that can be [parsed into a Duration](#parsing-duration-from-input-values) object.

```js
let options = {
    scrollTime: '08:00'
};
```

### select
- Type `function`
- Default `undefined`
- Requires `Interaction` plugin

Called when the user has selected a range of dates or time. The selection is enabled with [selectable](#selectable).

```js
let options = {
    selectable: true,
    select: ({start, end, allDay, resource}) => {
        console.log(start, end, allDay, resource?.title);
    }
};
```
The function receives an object with the following properties:
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

The selection stays highlighted until the user clicks anywhere on the page or [unselect()](#unselect-1) is called.

### selectable
- Type `boolean`
- Default `false`
- Requires `Interaction` plugin

Lets the user select several days or time slots by pressing and moving the pointer. The result is reported to the [select](#select) callback.

```js
let options = {
    selectable: true
};
```

### selectConstraint
- Type `function`
- Default `undefined`
- Requires `Interaction` plugin

Limits what can be selected.

The function is called on every move of the pointer during the selection. It receives the same argument as [select](#select), with the range as it would be selected, and returns `false` to forbid this range.

```js
let options = {
    selectable: true,
    // A selection cannot start on the weekend
    selectConstraint: ({start}) => ![0, 6].includes(start.getDay())
};
```
While the range is not allowed, the selection keeps the last allowed range and the cursor changes to `not-allowed`. Releasing the pointer there cancels the selection.

### selectBackgroundColor
- Type `string`
- Default `undefined`
- Requires `Interaction` plugin

The background color of the selection, see [selectable](#selectable).

The value is any CSS color, such as `'#f00'`, `'rgb(255,0,0)'` or `'red'`:

```js
let options = {
    selectable: true,
    selectBackgroundColor: '#93c5fd'
};
```

### selectLongPressDelay
- Type `integer`
- Default `undefined`
- Requires `Interaction` plugin

On touch devices, how many milliseconds the user has to hold a finger before the selection starts. A shorter touch scrolls the calendar.

```js
let options = {
    selectLongPressDelay: 500
};
```
Without a value, [longPressDelay](#longpressdelay) is used.

### selectMinDistance
- Type `integer`
- Default `5`
- Requires `Interaction` plugin

How many pixels the pointer has to move before the selection starts. It keeps a click with a slightly moved mouse from being taken as a selection.

```js
let options = {
    selectMinDistance: 10
};
```

### slotDuration
- Type `string`, `integer` or `object`
- Default `'00:30:00'`
> Views override the default value as follows:
> - resourceTimelineMonth `{days: 1}`
> - resourceTimelineYear `{days: 1}`

The length of one time slot, which is the step of the time grid.

The value is anything that can be [parsed into a Duration](#parsing-duration-from-input-values) object.

```js
let options = {
    // A slot of 15 minutes
    slotDuration: '00:15'
};
```
How often the slots are labeled is set with [slotLabelInterval](#slotlabelinterval), and the step of dragging, resizing and selecting with [snapDuration](#snapduration).

### slotEventOverlap
- Type `boolean`
- Default `true`

Lets the events that happen at the same time overlap each other a little in the `timeGrid` and `resourceTimeGrid` views, which leaves more room for each of them.

```js
let options = {
    slotEventOverlap: false
};
```
With `false`, such events are placed side by side and share the width of the column.

### slotHeight
- Type `integer`
- Default `24`

The height of a time slot in pixels in the `timeGrid` and `resourceTimeGrid` views.

```js
let options = {
    slotHeight: 36
};
```

### slotLabelFormat
- Type `object` or `function`
- Default `{hour: 'numeric', minute: '2-digit'}`

The format of the time labels of the slots.

The value is an object with the options of the native JavaScript [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat) object, or a function that returns the formatted [Content](#content).

```js
let options = {
    slotLabelFormat: {hour: '2-digit', minute: '2-digit', hour12: false}
    // or as a function
    // slotLabelFormat: time => time.toLocaleTimeString()
};
```
The function receives the JavaScript Date object to format.

### slotLabelInterval
- Type `string`, `integer` or `object`
- Default `undefined`

How often the time slots are labeled in the `timeGrid`, `resourceTimeGrid` and `resourceTimeline` views.

The value is anything that can be [parsed into a Duration](#parsing-duration-from-input-values) object.

```js
let options = {
    slotDuration: '00:15',
    // A label for each hour
    slotLabelInterval: '01:00'
};
```
Without a value, every slot is labeled, or every other slot if [slotDuration](#slotduration) is less than an hour.

### slotMaxTime
- Type `string`, `integer` or `object`
- Default `'24:00:00'`

The time of the day at which the time slots end. It can be later than midnight to show the night as a part of the previous day.

The value is anything that can be [parsed into a Duration](#parsing-duration-from-input-values) object.

```js
let options = {
    slotMinTime: '08:00',
    slotMaxTime: '18:00'
};
```

### slotMinTime
- Type `string`, `integer` or `object`
- Default `'00:00:00'`

The time of the day at which the time slots start.

The value is anything that can be [parsed into a Duration](#parsing-duration-from-input-values) object.

```js
let options = {
    slotMinTime: '08:00',
    slotMaxTime: '18:00'
};
```

### slotWidth
- Type `integer`
- Default `32`

The width of a time slot in pixels in the `resourceTimeline` views.

```js
let options = {
    slotWidth: 48
};
```

### snapDuration
- Type `string`, `integer` or `object`
- Default `undefined`

The step of time by which an event is [dragged](#editable) and [resized](#editable), and a range is [selected](#selectable). By default it is equal to [slotDuration](#slotduration).

The value is anything that can be [parsed into a Duration](#parsing-duration-from-input-values) object.

```js
let options = {
    slotDuration: '00:30',
    // The events are moved by 5 minutes
    snapDuration: '00:05'
};
```

### theme
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

### timeZone
- Type `string`
- Default `'local'`

The time zone the calendar uses to display dates and times.

The following values are accepted:
- `'local'` — uses the browser's local time zone
- `'UTC'` — uses UTC (zero offset)
- A UTC offset string in the form `'±HH:MM'`, e.g. `'+05:30'` or `'-06:00'`
- An [IANA time zone name](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones), e.g. `'America/Los_Angeles'` — follows the rules of that zone, including daylight saving time (DST). An unknown name is treated as `'local'`

Event dates that contain an explicit timezone offset in their ISO string (e.g. `'2028-06-01T10:00:00+02:00'` or `'2028-06-01T08:00:00Z'`) will be shifted to the calendar's timezone. Event dates without timezone info (e.g. `'2028-06-01T10:00:00'`) are treated as floating — they display their wall-clock time as-is and will be interpreted in the calendar's timezone from that point forward.

JavaScript Date objects in event dates are read as the wall-clock time of the calendar's timezone, the same way the calendar passes dates to callbacks and returns them from methods like [getEventById()](#geteventbyid-id-). So `new Date(2028, 5, 1, 10, 0)` is displayed as 10:00 in any timezone, and a date from a callback can be passed back to [addEvent()](#addevent-event-) or [updateEvent()](#updateevent-event-) as is. To pass an exact moment in time, use an ISO string with an offset, e.g. `date.toISOString()`.

When the `timeZone` option changes at runtime, all already-loaded events are automatically shifted to the new timezone. If the [date](#date) option comes from today (`undefined` or the today button, also after the prev/next buttons), it moves by the days between today in the old and in the new timezone. An explicitly set date stays the same day. Events from [eventSources](#eventsources) are re-fetched automatically.

A day always has 24 hours in the views, also on a DST day, as with `'local'`. The hour the clocks skip stays in the grid and the hour they repeat is shown once, so an event across the change is drawn longer or shorter than it lasts. A date without an offset in the skipped hour is read like `new Date()` reads it (02:30 means 03:30) and moves to 03:30 when `timeZone` changes, in the repeated hour it is read as its first occurrence.

A format option with `timeZoneName` shows the browser's time zone, not the calendar's.

```js
let options = {
    timeZone: '+02:00',
    events: [
        {
            start: '2028-06-01T10:00:00',        // floating — displayed as 10:00
            end:   '2028-06-01T12:00:00',
            title: 'Meeting'
        },
        {
            start: '2028-06-01T10:00:00+00:00',  // UTC — displayed as 12:00 in +02:00
            end:   '2028-06-01T12:00:00+00:00',
            title: 'Call'
        }
    ]
};
```

### titleFormat
- Type `object` or `function`
- Default `{year: 'numeric', month: 'short', day: 'numeric'}`
> Views override the default value as follows:
> - dayGridMonth `{year: 'numeric', month: 'long'}`
> - listDay `{year: 'numeric', month: 'long', day: 'numeric'}`
> - listMonth `{year: 'numeric', month: 'long'}`
> - listYear `{year: 'numeric'}`
> - resourceTimelineDay `{year: 'numeric', month: 'long', day: 'numeric'}`
> - resourceTimelineMonth `{year: 'numeric', month: 'long'}`
> - resourceTimelineYear `{year: 'numeric'}`
> - timeGridDay `{year: 'numeric', month: 'long', day: 'numeric'}`

The format of the title in the toolbar, which is the period the calendar shows.

The value is an object with the options of the native JavaScript [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat) object, or a function that returns the formatted [Content](#content).

```js
let options = {
    titleFormat: {year: 'numeric', month: 'long'}
    // or as a function
    // titleFormat: (start, end) => start.toDateString() + ' – ' + end.toDateString()
};
```
The function receives the following arguments:
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

Called when the current selection is cleared. It happens when:

- the user clicks anywhere on the page, unless [unselectAuto](#unselectauto) is `false`,
- the user makes a new selection, in which case it is called before the new selection is made,
- the calendar moves to another period or the view is switched,
- the [unselect()](#unselect-1) method is called.

```js
let options = {
    selectable: true,
    unselect: ({view}) => {
        console.log('The selection is cleared in', view.type);
    }
};
```
The function receives an object with the following properties:
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

Clears the current selection when the user clicks anywhere on the page. See [selectable](#selectable).

```js
let options = {
    selectable: true,
    // The selection stays until unselect() is called
    unselectAuto: false
};
```

### unselectCancel
- Type `string`
- Default `''`
- Requires `Interaction` plugin

A CSS selector for the elements that do not clear the selection when clicked, while [unselectAuto](#unselectauto) is on. For example, a form where the user enters the details of the selected time.

```js
let options = {
    selectable: true,
    unselectCancel: '.event-form'
};
```

### validRange
- Type `object`
- Default `undefined`

The range of dates the user can navigate within. The prev, next and today buttons are disabled when the whole period they lead to is outside of the range, and the days outside of it are disabled.

The value is an object with the following properties:
<table>
<tr>
<td>

`start`
</td>
<td>

`string` or `Date` This should be either an ISO8601 date string like `'2026-12-31'`, or a JavaScript Date object holding the range start date
</td>
</tr>
<tr>
<td>

`end`
</td>
<td>

`string` or `Date` This should be either an ISO8601 date string like `'2026-12-31'`, or a JavaScript Date object holding the range end date
</td>
</tr>
</table>

```js
let options = {
    validRange: {start: '2026-12-01', end: '2026-12-31'}
};
```
Either of the properties can be omitted, which leaves the range open on that side. The `end` date itself is inside the range.

The range limits the buttons only: methods like [gotoDate()](#gotodate-date-) and [next()](#next) can still move the calendar outside of it.

### view
- Type `string`
- Default `'timeGridWeek'`

The view the calendar shows.

```js
let options = {
    view: 'dayGridMonth'
};
```
The following views are available, each provided by the plugin of the same name:
- `'dayGridDay'`
- `'dayGridWeek'`
- `'dayGridMonth'`
- `'listDay'`
- `'listWeek'`
- `'listMonth'`
- `'listYear'`
- `'resourceTimeGridDay'`
- `'resourceTimeGridWeek'`
- `'resourceTimelineDay'`
- `'resourceTimelineWeek'`
- `'resourceTimelineMonth'`
- `'resourceTimelineYear'`
- `'timeGridDay'`
- `'timeGridWeek'`

As well as the views of your own that are defined in [views](#views).

### viewDidMount
- Type `function`
- Default `undefined`

Called right after a view is added to the page: when the calendar is created and each time the view is switched.

```js
let options = {
    viewDidMount: ({view}) => {
        console.log('Now showing', view.type);
    }
};
```
The function receives an object with the following properties:
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
A name that is not a standard view defines a new view. Its `type` is the standard view it is based on and takes the options from. The new view is then used like any other: in the [view](#view) option and in the [headerToolbar](#headertoolbar). The text of its button is set in [buttonText](#buttontext) under the name of the view.

This option is only read when the calendar is created. Changing it afterwards, either with [setOption](#setoption-name-value-) or reactively in Svelte, has no effect.

### weekNumberContent
- Type `Content` or `function`
- Default `undefined`

The content shown in place of the week number, which is `W01` by default. See [weekNumbers](#weeknumbers).

The value is a [Content](#content), or a function that returns it:

```js
let options = {
    weekNumbers: true,
    weekNumberContent: ({week}) => `Week ${week}`
};
```
The function receives an object with the following properties:
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

In Svelte, React, Vue and Angular this content can be rendered by the framework itself: with a [snippet](#content-snippets), [JSX](#rendering-content-with-react), a [slot](#rendering-content-with-slots) or a [template](#rendering-content-with-templates).

### weekNumbers
- Type `boolean`
- Default `false`

Shows the numbers of the weeks in the `dayGrid` and `resourceTimeline` views. A timeline of exactly one week does not show it.

```js
let options = {
    weekNumbers: true
};
```
The numbering depends on [firstDay](#firstday): with `0` the [Western](https://en.wikipedia.org/wiki/Week#Other_week_numbering_systems) system is used, and with any other value the [ISO](https://en.wikipedia.org/wiki/Week#The_ISO_week_date_system) one.

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

This method allows you to set new value to any calendar option. If `value` is `undefined`, the option is reset to its default value.

```js
// E.g. Change the current date
ec.setOption('date', new Date());
```

### setOptions( options )
- Parameters
  - `options` `object` The option names and their new values
- Return value `EventCalendar` The calendar instance for chaining

This method allows you to set several calendar options at once. An option with the `undefined` value is reset to its default value.

```js
ec.setOptions({
    view: 'timeGridDay',
    slotDuration: '00:15'
});
```

### addEvent( event )
- Parameters
  - `event` `object` A plain object that will be [parsed](#parsing-event-from-a-plain-object) into an [Event](#event-object) object
- Return value [Event](#event-object) object or `null` if the `event` can't be parsed

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
- Return value [Event](#event-object) object or `null`

Updates a single event with the matching `event`.`id`. Returns `null` if there is no such event or the `event` can't be [parsed](#parsing-event-from-a-plain-object).

### refetchEvents()
- Return value `EventCalendar` The calendar instance for chaining

Refetches events from all [sources](#eventsources).

### refetchResources()
- Return value `EventCalendar` The calendar instance for chaining

Refetches [resources](#resources) from URL or custom function.

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

### gotoDate( date )
- Parameters
  - `date` `Date`, `string` or `undefined` This value can be either a JavaScript Date object, or an ISO8601 date string like `'2026-12-31'`. `undefined` means today in the calendar's [timeZone](#timezone)
- Return value `EventCalendar` The calendar instance for chaining

Moves the current calendar date to the given date and, in views with horizontal scrolling (`resourceTimeline` views and `resourceTimeGrid` views with [datesAboveResources](#datesaboveresources) enabled), additionally scrolls the view to make this date visible.

Unlike `setOption('date', date)`, which scrolls the view to today whenever today is inside the new visible period, this method always scrolls to the given date.

```js
// E.g. Scroll to the date of the found event
ec.gotoDate(event.start);
```

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

A function that defines content can also return another function, which renders the content by itself. It receives the element and can return a function that is called when the content is no longer needed:
```js
function (info) {
    return el => {
        let chart = createChart(el, info.event.extendedProps.data);
        return () => chart.destroy();
    };
}
```
The calendar takes the changes in the size of such content into account.

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

Events of the same layout group within a resource row are laid out as a unit, at the place of the first of them in `eventOrder`: they take a rectangle from the start of the first one to the end of the last one, and no other event is placed inside it. Within the group, events are laid out among themselves the same way as the groups are laid out in the row, depending on [eventOrderStrict](#eventorderstrict). Only applies in `resourceTimeline` views
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

In month-based views such as `dayGridMonth` or `resourceTimelineMonth`, background events are displayed only if their `allDay` property is set to `true`
</td>
</tr>
<tr>
<td>

`layoutGroup`
</td>
<td>

`string` or `number` The layout group the event belongs to. Events of the same layout group within a resource row are laid out as a unit, at the place of the first of them in `eventOrder`: they take a rectangle from the start of the first one to the end of the last one, and no other event is placed inside it. Within the group, events are laid out among themselves the same way as the groups are laid out in the row, depending on [eventOrderStrict](#eventorderstrict). Only applies in `resourceTimeline` views
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

`expanded`
</td>
<td>

A flag indicating whether the resource is expanded or collapsed if it has nested children. `undefined` means the [resourcesInitiallyExpanded](#resourcesinitiallyexpanded) option applies
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

`expanded`
</td>
<td>

`boolean` Specifies whether the resource with nested children will be expanded or collapsed. Default `undefined`, which means the [resourcesInitiallyExpanded](#resourcesinitiallyexpanded) option applies
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

The `resourceTimeline` views support displaying nested resources. Nested resources can be collapsed or expanded using an additional button that appears before the parent resource name. To pass nested resources, use the `children` field:

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

You can also customize the colors in the calendar by overriding CSS variables, for example:
```css
.ec {
  --ec-bg-color: #22272e;
  --ec-text-color: #adbac7;
}
```
A list of all available CSS variables can be found [here](packages/core/src/styles/theme.css).

## Browser support

The latest versions of Chrome, Firefox, Safari, and Edge are [supported](https://vite.dev/guide/build.html#browser-compatibility).
