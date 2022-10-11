# Event Calendar changelog

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

* Drag&Drop optimization (switched to [Pointer Events](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events))

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