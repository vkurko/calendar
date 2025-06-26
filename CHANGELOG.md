# EventCalendar changelog

## 4.4.2
June 26, 2025
* Fixed an issue with `updateEvent()` producing an error ([516](https://github.com/vkurko/calendar/issues/516))

## 4.4.1
June 16, 2025
* Fixed event positioning issue ([511](https://github.com/vkurko/calendar/issues/511))

## 4.4.0
June 5, 2025
* Added `eventFilter` option ([500](https://github.com/vkurko/calendar/pull/500))

## 4.3.1
June 3, 2025
* Fixed error with `svelte >= 5.33.0` ([505](https://github.com/vkurko/calendar/issues/505), [507](https://github.com/vkurko/calendar/issues/507))
* Fixed infinite recursion when using calendar in Lit component ([142](https://github.com/vkurko/calendar/issues/142#issuecomment-2894606865))

## 4.3.0
May 16, 2025
* Added `nowIndicator` in `resourceTimeline` views ([427](https://github.com/vkurko/calendar/issues/427))

## 4.2.0
May 15, 2025
* Added CSS class `ec-today` to the current day header ([492](https://github.com/vkurko/calendar/issues/492))
* Fixed an issue with `updateEvent()` not updating CSS classes ([496](https://github.com/vkurko/calendar/issues/496))
* Reverted the previous behavior of `eventTextColor` option when it was not applied in `list` view ([497](https://github.com/vkurko/calendar/issues/497))

## 4.1.0
May 9, 2025
* Added ability to use `slotLabelInterval` option in `resourceTimeline` views ([372](https://github.com/vkurko/calendar/issues/372))
* Fixed an issue with `dateClick` triggered on `eventClick` ([490](https://github.com/vkurko/calendar/issues/490))
* Fixed infinite recursion when using calendar in Lit component ([142](https://github.com/vkurko/calendar/issues/142#issuecomment-2847030101))

## 4.0.3
April 25, 2025
* Fixed issues [474](https://github.com/vkurko/calendar/issues/474) and [475](https://github.com/vkurko/calendar/issues/475)

## 4.0.2
April 21, 2025
* Fixed nested resource expander in `resourceTimeline` views
* Added scrolling of resources when rotating the mouse wheel over resources in `resourceTimeline` views

## 4.0.1
April 16, 2025
* Fixed row height sync issue in `resourceTimeline` views

## 4.0.0
April 16, 2025
* Added support for Svelte 5 ([359](https://github.com/vkurko/calendar/issues/359))
* :warning: Svelte 4 is not supported anymore
* :warning: All plugins have been moved to the `@event-calendar/core` package
* :warning: In ES modules, you now need to use `createCalendar(target, plugins, options)` to initialize the calendar
* :warning: With standalone bundle, you now need to use `EventCalendar.create(target, options)` to initialize the calendar
* The following options now have higher priority from left to right `event.startEditable` > `eventStartEditable` > `editable` and `event.durationEditable` > `eventDurationEditable` > `editable` ([440](https://github.com/vkurko/calendar/issues/440))

## 3.12.0
April 1, 2025

* Added `dragConstraint`, `resizeConstraint` and `selectConstraint` options ([412](https://github.com/vkurko/calendar/issues/412))

## 3.11.0
March 29, 2025

* Added `slotLabelInterval` option ([329](https://github.com/vkurko/calendar/issues/329))

## 3.10.1
March 25, 2025

* Fixed an issue with displaying events shorter than the slot duration ([423](https://github.com/vkurko/calendar/issues/423))

## 3.10.0
February 4, 2025

* Added `validRange` option ([141](https://github.com/vkurko/calendar/issues/141))

## 3.9.0
January 27, 2025

* Added support for week numbers in `dayGrid` view ([389](https://github.com/vkurko/calendar/issues/389))
* Fixed dates in the return value of the `addEvent()` method ([419](https://github.com/vkurko/calendar/issues/419))

## 3.8.0
January 6, 2025

* Added the ability to resize the event from its starting edge ([343](https://github.com/vkurko/calendar/issues/343))

## 3.7.2
December 18, 2024

* Fixed an issue with overlapping events with zero duration ([377](https://github.com/vkurko/calendar/issues/377))
* Fixed an issue with displaying resources in `resourceTimeGrid` view after expanding/collapsing nested resources in `resourceTimeline` view ([393](https://github.com/vkurko/calendar/issues/393))

## 3.7.1
November 29, 2024

* Now the minimum displayed event size is fixed at the `slotDuration` value ([377](https://github.com/vkurko/calendar/issues/377))

## 3.7.0
November 7, 2024

* Added support for nested resources ([302](https://github.com/vkurko/calendar/issues/302))

## 3.6.2
October 17, 2024

* Fixed an issue in `resourceTimeline` views with displaying events beyond midnight when `slotMaxTime` is greater than `24:00` ([333](https://github.com/vkurko/calendar/issues/333))

## 3.6.1
October 1, 2024

* Fixed `destroy()` method in pure JS version of the library

## 3.6.0
October 1, 2024

* Fixed some issues in Svelte 5 ([235](https://github.com/vkurko/calendar/issues/235))
* :warning: `destroy()` is no longer available in Svelte version

## 3.5.0
September 20, 2024

* Added `extendedProps` for resources ([310](https://github.com/vkurko/calendar/discussions/310))
* Added `filterEventsWithResources` option

## 3.4.0
August 1, 2024

* Added the ability to set additional styles for a specific event ([305](https://github.com/vkurko/calendar/issues/305))
* Added the ability to set additional CSS classes for a specific event
* Added the ability to apply default rendering in the `eventContent` callback by returning `undefined` ([306](https://github.com/vkurko/calendar/discussions/306))
* Fixed return value of `addEvent` and `updateEvent` methods ([301](https://github.com/vkurko/calendar/issues/301))

## 3.3.0
July 26, 2024

* Now all-day background events are rendered in `dayGridMonth`/`resourceTimelineMonth` views, as well as in the `all-day` slot of the `timeGrid` views ([300](https://github.com/vkurko/calendar/discussions/300))
* Fixed `endDelta` in `eventResize` callback ([145](https://github.com/vkurko/calendar/issues/145#issuecomment-2244686814))
* Fixed display of events in `resourceTimeline` views when the start of the event falls after `slotMaxTime`

## 3.2.2
July 22, 2024

* Fixed an issue with `dateFromPoint` method ([145](https://github.com/vkurko/calendar/issues/145#issuecomment-2236673640))

## 3.2.1
July 15, 2024

* Fixed an issue with the pointer not hiding when hovering over the `all-day` slot

## 3.2.0
July 14, 2024

* Added the ability to pass `html` to custom buttons ([277](https://github.com/vkurko/calendar/issues/277))
* Added `active` parameter for custom buttons
* Fixed event background color defined from resource ([295](https://github.com/vkurko/calendar/issues/295))

## 3.1.0
June 21, 2024

* Added `resourceTimelineMonth` view ([275](https://github.com/vkurko/calendar/issues/275))
* Added `next()` and `prev()` methods ([279](https://github.com/vkurko/calendar/issues/279))
* Added CSS classes for toolbar sections ([283](https://github.com/vkurko/calendar/issues/283))

## 3.0.2
June 3, 2024

* Fixed so that `ResourceTimeline` plugin does not depend on `ResourceTimeGrid`
* Fixed minor visual defects in `resourceTimeline` view

## 3.0.1
May 24, 2024

* Fixed `scrollTime` in `resourceTimeline` view
* Fixed an issue with erroneous vertical scrolling in `resourceTimeline` view

## 3.0.0
May 23, 2024

* Added `resourcesTimeline` view ([30](https://github.com/vkurko/calendar/issues/30))

## 2.7.2
May 22, 2024

* Fixed issue with `scrollTime` option reactivity  ([270](https://github.com/vkurko/calendar/issues/270))

## 2.7.1
May 15, 2024

* Fixed an issue with event positioning when `dayMaxEvents` is triggered ([264](https://github.com/vkurko/calendar/issues/264))

## 2.7.0
May 8, 2024

* Added `customButtons` option ([159](https://github.com/vkurko/calendar/issues/159))

## 2.6.1
January 29, 2024

* Fixed calendar functionality in iOS 15 ([227](https://github.com/vkurko/calendar/issues/227))

## 2.6.0
January 8, 2024

* Added experimental `eventAllUpdated` option ([96](https://github.com/vkurko/calendar/issues/96))

## 2.5.1
December 18, 2023

* Fixed unwanted keyboard accessibility of events in `list` view when the `eventClick` is not set

## 2.5.0
December 9, 2023

* A11y improvements: events are now accessible from the keyboard, added `dayHeaderAriaLabelFormat` option ([161](https://github.com/vkurko/calendar/issues/161))
* All dates and times are now rendered using `<time>` tag ([161](https://github.com/vkurko/calendar/issues/161))
* Events are now rendered using `<article>` and `<h4>` tags instead of `<div>` ([161](https://github.com/vkurko/calendar/issues/161))
* `dateFromPoint` now works for events in `list` view

## 2.4.1
October 21, 2023

* Changed the way the dark theme is automatically activated. Now this feature should be explicitly enabled using the `ec-auto-dark` CSS class
* Fixed an issue with the positioning of the popup in month view

## 2.4.0
October 20, 2023

* Added support for dark theme ([68](https://github.com/vkurko/calendar/issues/68))

## 2.3.3
September 11, 2023

* Fixed an issue with automatically updating the current day ([181](https://github.com/vkurko/calendar/discussions/181))

## 2.3.2
August 30, 2023

* Another attempt to fix the bug in SvelteKit when using a function for the `theme` option ([179](https://github.com/vkurko/calendar/issues/179))

## 2.3.1
August 29, 2023

* Fixed a bug in SvelteKit when using a function for the `theme` option ([179](https://github.com/vkurko/calendar/issues/179))

## 2.3.0
August 25, 2023

* Added CSS classes for days of the week ([156](https://github.com/vkurko/calendar/issues/156))
* The initial value of the `height` option has changed to `undefined`

## 2.2.0
August 24, 2023

* Added `dayCellFormat` option ([169](https://github.com/vkurko/calendar/pull/169))

## 2.1.0
August 22, 2023

* Improved CSS class switching on view change ([155](https://github.com/vkurko/calendar/issues/155))

## 2.0.0
August 17, 2023

* :warning: To pass an HTML version of the title for an event, you now need to use the appropriate [Content](https://github.com/vkurko/calendar#content) value in the `title` field
* :warning: The [eventTimeFormat](https://github.com/vkurko/calendar#eventtimeformat) given as a function now takes 2 input parameters ([149](https://github.com/vkurko/calendar/issues/149))
* :warning: Formatting time intervals is now done using [Intl.DateTimeFormat.formatRange()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/formatRange)
* In all date and time formatting options that are set as a function, it is now allowed to return an HTML version of the content ([170](https://github.com/vkurko/calendar/pull/170))

## 1.5.1
July 26, 2023

* Fixed A11y warnings after updating to Svelte 4.x ([160](https://github.com/vkurko/calendar/issues/160))

## 1.5.0
June 14, 2023

* Added `eventClassNames` option ([106](https://github.com/vkurko/calendar/issues/106))

## 1.4.1
June 14, 2023

* Fixed a bug with duplicate `eventSources.events` call ([146](https://github.com/vkurko/calendar/issues/146))

## 1.4.0
June 12, 2023

* Now time is not rendered inside `allDay` events ([143](https://github.com/vkurko/calendar/issues/143))
* Fixed interaction functions inside the shadow root ([142](https://github.com/vkurko/calendar/issues/142))

## 1.3.1
May 30, 2023

* Fixed an issue with incorrect `dateClick` information when using specific `slotMinTime` settings ([135](https://github.com/vkurko/calendar/issues/135))

## 1.3.0
May 25, 2023

* Added the ability to set an event filter for `flexibleSlotTimeLimits` ([133](https://github.com/vkurko/calendar/issues/133))

## 1.2.0
May 23, 2023

* :warning: The `@event-calendar/common` package has been deprecated. Its content has been moved to the `@event-calendar/core` package ([132](https://github.com/vkurko/calendar/issues/132))
* Now drag&drop doesn't start on right click ([#131](https://github.com/vkurko/calendar/issues/131))

## 1.1.1
May 15, 2023

* Fixed a bug where `addEvent` did not immediately update the event store ([#124](https://github.com/vkurko/calendar/pull/124))

## 1.1.0
May 11, 2023

* Added `eventTextColor` option ([#116](https://github.com/vkurko/calendar/pull/116))
* Fixed various issues in the `Interaction` plugin

## 1.0.0
May 10, 2023

* Reduced code size by 15% due to refactoring of the `Interaction` plugin
* Fixed `dateClick` on background events ([#118](https://github.com/vkurko/calendar/pull/118))
* :warning: `dateFromPoint` method changed return data type
* :warning: `dateClick` now requires `Interaction` plugin

## 0.19.0
April 28, 2023

* Added `slotEventOverlap` option ([#112](https://github.com/vkurko/calendar/pull/112))

## 0.18.1
April 20, 2023

* Fixed JS error `t?.handleScroll is not a function`

## 0.18.0
April 20, 2023

* Added `eventBackgroundColor` property to resource object ([#104](https://github.com/vkurko/calendar/issues/104))
* Now events with dates specified without a time part are considered all-day events
* Fixed `datesSet` callback to pass `view` object ([#102](https://github.com/vkurko/calendar/issues/102))
* Fixed triggering of mouse events on background events ([#105](https://github.com/vkurko/calendar/issues/105))

## 0.17.1
April 12, 2023

* Fixed a bug when `unselect` method didn't work inside `select` callback ([#100](https://github.com/vkurko/calendar/issues/100))

## 0.17.0
February 27, 2023

* Added `destroy` method
* Fixed minor issues in month view

## 0.16.1
February 22, 2023

* Fixed positioning of events in month view ([#85](https://github.com/vkurko/calendar/issues/85#issuecomment-1438242063))
* Improved positioning speed

## 0.16.0
February 17, 2023

* Added `dateFromPoint` method ([#83](https://github.com/vkurko/calendar/issues/83))

## 0.15.3
January 30, 2023

* Fixed a bug where `select` handler would provide an incorrect value for `resource` ([#81](https://github.com/vkurko/calendar/issues/81))

## 0.15.2
January 30, 2023

* Fixed a bug with calling the `dateClick` handler when clicking on the all-day event ([#80](https://github.com/vkurko/calendar/issues/80))

## 0.15.1
January 12, 2023

* Fixed regression bug in month view ([#74](https://github.com/vkurko/calendar/issues/74))

## 0.15.0
January 7, 2023

* :warning: Dropped support for IE
* :warning: The pre-built bundle no longer includes the `modern` version (use the main version instead)

## 0.14.3
January 5, 2023

* Added scrolling in the popup in month view when there are too many events in it
* Fixed other minor bugs in the popup when dragging events

## 0.14.2
January 2, 2023

* Fixed library loading issue in SvelteKit v1.0.0 ([#72](https://github.com/vkurko/calendar/issues/72))
* Removed dependency on `day-grid` in `time-grid` package ([#71](https://github.com/vkurko/calendar/issues/71))

## 0.14.1
December 13, 2022

* Now you should expect new DOM elements to be created for new events when the display period is changed ([#17](https://github.com/vkurko/calendar/issues/17))
* Fixed date value when using `getOption('date')`

## 0.14.0
November 21, 2022

* Added `resourceLabelContent` and `resourceLabelDidMount` ([#62](https://github.com/vkurko/calendar/discussions/62))
* Improved handling of mouse click events. Now [dateClick](https://github.com/vkurko/calendar#dateclick) will not be called on select, drag or click an event
* :warning: The [Event](https://github.com/vkurko/calendar#event-object) object now has a separate `titleHTML` field to render the HTML version of the title, and the original `title` field will now be rendered as text
* :warning: [eventContent](https://github.com/vkurko/calendar#eventcontent) and similar settings now render the string as plain text instead of HTML. To render HTML, you must pass it as `{html: '<p>...</p>'}`

## 0.13.4
November 7, 2022

* Fixed an issue when `nowIndicator` is not updated when a new day arrives ([#64](https://github.com/vkurko/calendar/issues/64))

## 0.13.3
November 3, 2022

* Fixed some minor issues in month and list views

## 0.13.2
November 2, 2022

* Fixed an issue with month view when it is the first day of the month ([#63](https://github.com/vkurko/calendar/issues/63))

## 0.13.1
October 14, 2022

* Fixed issues with previous version

## 0.13.0
October 14, 2022

* Added `longPressDelay` and other options to improve touch support

## 0.12.0
October 11, 2022

* Added the ability to `select` time intervals ([#8](https://github.com/vkurko/calendar/issues/8))

## 0.11.2
July 20, 2022

* Fixed issue with displaying events without duration in month view ([#50](https://github.com/vkurko/calendar/issues/50))

## 0.11.1
June 3, 2022

* Fixed regression bug with `eventDrop` ([#43](https://github.com/vkurko/calendar/issues/43))

## 0.11.0
May 27, 2022

* Added `all-day` slot ([#41](https://github.com/vkurko/calendar/issues/41))

## 0.10.2
April 27, 2022

* Fixed minor visual issues

## 0.10.1
April 26, 2022

* Fixed regression bugs with calendar display ([#39](https://github.com/vkurko/calendar/issues/39))

## 0.10.0
April 25, 2022

* Added the ability to `resize` events ([#15](https://github.com/vkurko/calendar/issues/15))

## 0.9.0
April 4, 2022

* Added `getEvents` method ([#37](https://github.com/vkurko/calendar/issues/37))

## 0.8.3
February 22, 2022

* Removed dependency on `sass` in Svelte/SvelteKit modules ([#26](https://github.com/vkurko/calendar/issues/26#issuecomment-1047812407))

## 0.8.2
February 21, 2022

* Added support for SvelteKit ([#26](https://github.com/vkurko/calendar/issues/26))

## 0.8.1
February 4, 2022

* Fixed an issue with the `nowIndicator` and `slotMaxTime` option ([#29](https://github.com/vkurko/calendar/issues/29))

## 0.8.0
January 28, 2022

* Added `nowIndicator` option ([#29](https://github.com/vkurko/calendar/issues/29))

## 0.7.1
October 13, 2021

* Added minimum width for the `dayMaxEvents` popover ([#24](https://github.com/vkurko/calendar/issues/24))
* Fixed issues with `addEvent`, `updateEvent` and `removeEventById` methods

## 0.7.0
September 29, 2021

* Added `dayMaxEvents` option with implemented value `true` ([#23](https://github.com/vkurko/calendar/issues/23))

## 0.6.0
September 28, 2021

* Added mouse cursor `pointer` in `timeGrid`/`resourceTimeGrid` views

## 0.5.0
September 1, 2021

* Added ability to disable `editable` on per event basis ([#22](https://github.com/vkurko/calendar/issues/22))

## 0.4.0
August 30, 2021

* Added `datesSet` option ([#20](https://github.com/vkurko/calendar/issues/20))
* Added `dateStr` and `dayEl` parameters for the `dateClick` callback
* Added `startStr` and `endStr` parameters for the `events` callback of the `eventSources` option

## 0.3.3
August 26, 2021

* Fixed another drag&drop regression bug

## 0.3.2
August 26, 2021

* Fixed an issue in IE11

## 0.3.1
August 26, 2021

* Drag&drop optimization (switched to [Pointer Events](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events))

## 0.3.0
August 19, 2021

* :warning: `hideResourcesWithNoEvents` was renamed to `filterResourcesWithEvents`
* Added ability to specify slot height ([#16](https://github.com/vkurko/calendar/issues/16))
* Added ability to render date headings above resource headings ([#19](https://github.com/vkurko/calendar/issues/19))

## 0.2.0
July 2, 2021

* Added ability to specify event source as a function ([#5](https://github.com/vkurko/calendar/issues/5))

## 0.1.2
May 20, 2021

* Fixed vulnerabilities in dependencies

## 0.1.1
April 12, 2021

* Fixed an issue with incorrect JS event type recognition

## 0.1.0
April 12, 2021

* Added drag&drop feature (`Interaction` plugin)
* Added Sass + Autoprefixer

## 0.0.1
March 22, 2021

* Initial release