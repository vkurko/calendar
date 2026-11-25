# EventCalendar for Angular

The Angular component of [EventCalendar](https://github.com/vkurko/calendar), a full-sized drag & drop JavaScript event calendar with resource & timeline views.

See the [demo](https://vkurko.github.io/calendar/) and the [documentation](https://github.com/vkurko/calendar#readme) of all options and methods.

## Usage
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
All [options](https://github.com/vkurko/calendar#options) are passed as one object. To change them, pass a new object: the calendar is updated with the options that are different in it.

The calendar is destroyed gracefully when the component containing it is destroyed.

### Rendering content with templates
The following options can be given as templates with the `ecContent` directive:

* [allDayContent](https://github.com/vkurko/calendar#alldaycontent)
* [dayCellContent](https://github.com/vkurko/calendar#daycellcontent)
* [eventContent](https://github.com/vkurko/calendar#eventcontent)
* [moreLinkContent](https://github.com/vkurko/calendar#morelinkcontent)
* [noEventsContent](https://github.com/vkurko/calendar#noeventscontent)
* [resourceLabelContent](https://github.com/vkurko/calendar#resourcelabelcontent)
* [weekNumberContent](https://github.com/vkurko/calendar#weeknumbercontent)
* the `content` property of [customButtons](https://github.com/vkurko/calendar#custombuttons): the template is named `customButton` followed by the name of the button with the first letter capitalized

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

### Calling methods in Angular
The [methods](https://github.com/vkurko/calendar#methods) of the calendar are the methods of the component:
```html
<event-calendar #calendar [plugins]="plugins" [options]="options()"/>
<button (click)="calendar.next()">Next</button>
```

## License
MIT
