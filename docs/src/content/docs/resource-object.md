---
title: "Resource object"
description: "This is a JavaScript object that EventCalendar uses to store information about a resource. Calendar events can be associated with resources and displayed…"
---

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

The title of the resource. See [Content](../content/)
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

A flag indicating whether the resource is expanded or collapsed if it has nested children. `undefined` means the [resourcesInitiallyExpanded](../options/resourcesinitiallyexpanded/) option applies
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

## Parsing resource from a plain object
When EventCalendar receives an array of plain resource’s objects for the `resources` option, it parses the input objects into proper Resource objects.

Here are all admissible fields for the resource’s input object:
<table>
<tr>
<td>

`id`
</td>
<td>

`integer` or `string` Uniquely identifies the resource. [Event](../event-object/) objects with a corresponding `resourceIds` field will be linked to this resource. Will be coerced into a `string`
</td>
</tr>
<tr>
<td>

`title`
</td>
<td>

`Content` Text that will be displayed on the resource when it is rendered. See [Content](../content/). Default `''`
</td>
</tr>
<tr>
<td>

`eventBackgroundColor`
</td>
<td>

`string` Sets the default background color for this resource's events just like the calendar-wide [eventBackgroundColor](../options/eventbackgroundcolor/) option. Default `undefined`
</td>
</tr>
<tr>
<td>

`eventTextColor`
</td>
<td>

`string` Sets the default text color for this resource's events just like the calendar-wide [eventTextColor](../options/eventtextcolor/) option. Default `undefined`
</td>
</tr>
<tr>
<td>

`expanded`
</td>
<td>

`boolean` Specifies whether the resource with nested children will be expanded or collapsed. Default `undefined`, which means the [resourcesInitiallyExpanded](../options/resourcesinitiallyexpanded/) option applies
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
