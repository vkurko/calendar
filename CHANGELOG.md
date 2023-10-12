# Event Calendar changelog

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

* Added "all-day" slot ([#41](https://github.com/vkurko/calendar/issues/41))

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