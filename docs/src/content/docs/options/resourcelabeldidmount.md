---
title: "resourceLabelDidMount"
description: "Called right after the element of a resource label is added to the page. This is the place to attach something to the element: a tooltip, for example."
---

- Type `function`
- Default `undefined`

Called right after the element of a resource label is added to the page. This is the place to attach something to the element: a tooltip, for example.

```js
let options = {
    resourceLabelDidMount: ({resource, el}) => {
        el.title = resource.title;
    }
};
```
The function receives an object with the following properties:
<table>
<tr>
<td>

`el`
</td>
<td>The HTML element for the label</td>
</tr>
<tr>
<td>

`resource`
</td>
<td>

The associated [Resource](../../resource-object/) object
</td>
</tr>
<tr>
<td>

`date`
</td>
<td>If it is a column that is within a specific date, this will be a Date object</td>
</tr>
</table>

It is called once for each element. The elements are created again, and the function is called again, when the resources are loaded again.
