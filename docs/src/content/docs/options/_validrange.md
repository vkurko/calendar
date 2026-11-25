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

The range limits the buttons only: methods like [gotoDate()](../../methods/gotodate/) and [next()](../../methods/next/) can still move the calendar outside of it.
