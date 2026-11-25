---
title: "View object"
description: "A View object contains information about a calendar view, such as title and date range."
---

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
