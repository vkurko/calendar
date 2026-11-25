---
title: "Content"
description: "The content value can be presented in the following forms:"
---

The content value can be presented in the following forms:

* a string containing text `'some text'`
* an object containing the HTML string `{html: '<p>some HTML</p>'}`
* an object containing an array of DOM nodes `{domNodes: [node1, node2, ...]}`

A function that defines content can also return another function, which renders the content by itself. It receives the element and can return a function that is called when the content is no longer needed:
```js
function (info) {
    return el => {
        let chart = createChart(el, info.event.extendedProps.data);
        return () => chart.destroy();
    };
}
```
The calendar takes the changes in the size of such content into account.
