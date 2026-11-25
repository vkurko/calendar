- Type `string`
- Default `undefined`

The language and the regional format of the dates and times in the calendar: of the title, the headings, the time of the events and so on.

The value is a locale for the native JavaScript [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#locales) object. Without a value the locale of the browser is used.

```js
let options = {
    locale: 'de'
};
```
Only the dates and times follow the locale. The texts of the buttons are set with [buttonText](../buttontext/), the other texts, such as `all-day` and `No events`, with the content options, and the first day of the week with [firstDay](../firstday/).
