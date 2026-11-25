- Type `boolean`
- Default `false`

Styles the scrollbars of the calendar, which also keeps them always visible in the browsers that [support](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::-webkit-scrollbar#browser_compatibility) it.

It is useful on macOS, where the scrollbars are hidden until you scroll: in a `resourceTimeline` view nothing would tell the user that the calendar can be scrolled horizontally.

```js
let options = {
    customScrollbars: true
};
```
