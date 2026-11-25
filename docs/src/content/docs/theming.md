---
title: "Theming"
description: "The library provides a built-in dark theme. You can activate it by adding the ec-dark CSS class to any parent element of the calendar, e.g. <body…"
---

The library provides a built-in dark theme. You can activate it by adding the `ec-dark` CSS class to any parent element of the calendar, e.g. `<body class="ec-dark">`.

If you want the dark theme to be activated automatically based on the [preferred color scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme), then use the `ec-auto-dark` CSS class instead.

You can also customize the colors in the calendar by overriding CSS variables, for example:
```css
.ec {
  --ec-bg-color: #22272e;
  --ec-text-color: #adbac7;
}
```
A list of all available CSS variables can be found [here](https://github.com/vkurko/calendar/blob/master/packages/core/src/styles/theme.css).
