- Type `array`, `object` or `function`
- Default `[]`

The resources of the resource views: rooms, people, machines, or anything else the events belong to. An event refers to its resources with the `resourceId` or `resourceIds` property.

They can be given in one of three ways:

#### 1. Array of plain objects
If the resources are known in advance, pass them as an array of plain objects, which are [parsed](../../resource-object/#parsing-resource-from-a-plain-object) into [Resource](../../resource-object/) objects:

```js
let options = {
    resources: [
        {id: 1, title: 'Room A'},
        {id: 2, title: 'Room B', children: [
            {id: 3, title: 'Room B1'}
        ]}
    ]
};
```

#### 2. Fetch resources from a URL
To load the resources from a server, pass an object with the following properties:
<table>
<tr>
<td>

`url`
</td>
<td>

A URL from which the calendar will fetch an array of [parsable](../../resource-object/#parsing-resource-from-a-plain-object) [Resource](../../resource-object/) objects in JSON format. If [refetchResourcesOnNavigate](../refetchresourcesonnavigate/) is enabled then HTTP requests with the following parameters will be sent to the URL whenever the user navigates to a different date:
<table>
<tr>
<td>

`start`
</td>
<td>
Start date of the range the calendar needs resources for
</td>
</tr>
<tr>
<td>

`end`
</td>
<td>
End date of the range the calendar needs resources for
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

```js
let options = {
    resources: {url: '/resources'}
};
```

#### 3. Execute custom function
The resources can also be provided by your own function:

```js
let options = {
    resources: async fetchInfo => (await fetch('/api/resources')).json()
};
```
The function receives `fetchInfo`, `successCallback` and `failureCallback`. If [refetchResourcesOnNavigate](../refetchresourcesonnavigate/) is enabled, the function is called each time the calendar moves to another period, and `fetchInfo` is an object with the following properties. Otherwise it is an empty object.
<table>
<tr>
<td>

`start`
</td>
<td>JavaScript Date object for the beginning of the range the calendar needs resources for</td>
</tr>
<tr>
<td>

`end`
</td>
<td>JavaScript Date object for the end of the range the calendar needs resources for. Note: This value is exclusive</td>
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

The function passes an array of [parsable](../../resource-object/#parsing-resource-from-a-plain-object) [Resource](../../resource-object/) objects to `successCallback`, or the information about a failure to `failureCallback`. Instead of calling them, it can return the array or a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) (or a [thenable](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/resolve)) of it.
