import {derived, writable, get} from 'svelte/store';
import {is_function} from 'svelte/internal';
import {toLocalDate} from './date';

export function writable2(value, parser, start) {
    return {
        ...writable(value, start),
        parse: parser
    };
}

export function derived2(stores, fn, initValue) {
    let storeValue = initValue;
    let hasSubscribers = false;
    let auto = fn.length < 2;
    let fn2 = (_, set) => {
        hasSubscribers = true;
        if (auto) {
            storeValue = fn(_, set);
            set(storeValue);
        } else {
            fn(_, value => {storeValue = value; set(value);});
        }
        return () => {hasSubscribers = false;};
    };
    let store = derived(stores, fn2, storeValue);
    return {
        ...store,
        get: () => hasSubscribers ? storeValue : get(store)
    };
}

export function intl(locale, format) {
    return derived([locale, format], ([$locale, $format]) => {
        let intl = is_function($format)
            ? {format: $format}
            : new Intl.DateTimeFormat($locale, $format);
        return {
            format: date => intl.format(toLocalDate(date))
        };
    });
}

export function intlRange(locale, format) {
    return derived([locale, format], ([$locale, $format]) => {
        let intl = is_function($format)
            ? {formatRange: $format}
            : new Intl.DateTimeFormat($locale, $format);
        return {
            formatRange: (start, end) => intl.formatRange(toLocalDate(start), toLocalDate(end))
        };
    });
}
