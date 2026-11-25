# EventCalendar for Vue

The Vue component of [EventCalendar](https://github.com/vkurko/calendar), a full-sized drag & drop JavaScript event calendar with resource & timeline views.

See the [demo](https://vkurko.github.io/calendar/) and the [documentation](https://github.com/vkurko/calendar#readme) of all options and methods.

## Usage
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
All [options](https://github.com/vkurko/calendar#options) are passed as props, and the calendar is updated when they change, including the changes inside reactive objects and arrays, such as `events.value.push(event)`. The callbacks can also be used as event listeners. The `class`, `style` and `id` attributes are set on the element that wraps the calendar.

The calendar is destroyed gracefully when the component containing it is destroyed.

### Rendering content with slots
The following options can be given as slots:

* [allDayContent](https://github.com/vkurko/calendar#alldaycontent)
* [dayCellContent](https://github.com/vkurko/calendar#daycellcontent)
* [eventContent](https://github.com/vkurko/calendar#eventcontent)
* [moreLinkContent](https://github.com/vkurko/calendar#morelinkcontent)
* [noEventsContent](https://github.com/vkurko/calendar#noeventscontent)
* [resourceLabelContent](https://github.com/vkurko/calendar#resourcelabelcontent)
* [weekNumberContent](https://github.com/vkurko/calendar#weeknumbercontent)
* the `content` property of [customButtons](https://github.com/vkurko/calendar#custombuttons): the slot is named `customButton` followed by the name of the button with the first letter capitalized

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

### Calling methods in Vue
The [methods](https://github.com/vkurko/calendar#methods) of the calendar are available through the template ref:
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

## License
MIT
