---
title: "dayHeaderAriaLabelFormat"
description: "The format of the aria-label attribute of the column headings, which is what screen readers announce instead of the short visible text."
---

- Type `object` or `function`
- Default `{dateStyle: 'full'}`
> Views override the default value as follows:
> - dayGridMonth `{weekday: 'long'}`

The format of the `aria-label` attribute of the column headings, which is what screen readers announce instead of the short visible text.

The value is an object with the options of the native JavaScript [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat) object, or a function that returns the formatted string.

```js
let options = {
    dayHeaderAriaLabelFormat: {weekday: 'long', month: 'long', day: 'numeric'}
    // or as a function
    // dayHeaderAriaLabelFormat: date => date.toDateString()
};
```
The function receives the JavaScript Date object to format.
