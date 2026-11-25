- Type `function`
- Default `undefined`

Called when the calendar starts and when it finishes loading events or resources from their sources. It is the place to show and hide a spinner.

```js
let options = {
    loading: isLoading => {
        spinner.hidden = !isLoading;
    }
};
```
The function receives `true` when the loading starts, and `false` when it is done.
