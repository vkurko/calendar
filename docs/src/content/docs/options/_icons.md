- Type `object`
- Default `{collapse: {html: '&minus;'}, expand: {html: '&plus;'}}`

The icons of the buttons that have no text: currently, the buttons that collapse and expand nested resources in the `resourceTimeline` views.

The value is an object where each icon is a [Content](../../content/), or a function that receives the default icons and returns the new ones:

```js
let options = {
    icons: icons => ({...icons, collapse: {html: '▾'}, expand: {html: '▸'}})
};
```
An object replaces the default icons completely, so it has to contain all of them.
