# Event Calendar changelog

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

* Fixed an issue with IE11 support

## 0.3.1
August 26, 2021

* Drag&Drop optimization (switch to [Pointer Events](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events))

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

* Fixed an issue with correct JS event type recognition

## 0.1.0
April 12, 2021

* Added drag&drop feature (`Interaction` plugin)
* Added Sass + Autoprefixer

## 0.0.1
March 22, 2021

* Initial release