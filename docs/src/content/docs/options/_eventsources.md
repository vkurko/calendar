- Type `EventSource[]`
- Default `[]`

The sources the calendar loads its events from: URLs or functions. The events are requested for the period the calendar shows, and again when it moves outside of the loaded period, see [lazyFetching](../lazyfetching/).

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
If this option is given, the [events](../events/) option is not used. The start and the end of the loading are reported to the [loading](../loading/) callback.

A source is an object with one of the following sets of properties:

#### 1. Fetch events from a URL
<table>
<tr>
<td>

`url`
</td>
<td>

A URL from which the calendar will fetch an array of [parsable](../../event-object/#parsing-event-from-a-plain-object) [Event](../../event-object/) objects in JSON format. HTTP requests with the following parameters will be sent to this URL whenever the calendar needs new event data:
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
The value of the calendar's [timeZone](../timezone/) option. Sent only when `timeZone` is not `'local'`
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
<td>The value of the calendar's [timeZone](../timezone/) option</td>
</tr>
</table>

The `successCallback` function must be called by the custom function with an array of [parsable](../../event-object/#parsing-event-from-a-plain-object) [Event](../../event-object/) objects.

If there is any failure (e.g., if an AJAX request fails), then call the `failureCallback` instead. It accepts an argument with information about the failure.

Instead of calling `successCallback` and `failureCallback`, you may return the resulting array of events or return a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) (or [thenable](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/resolve)) object instead.
</td>
</tr>
</table>
