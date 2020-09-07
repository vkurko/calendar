import {derived, writable, get} from 'svelte/store';
import {is_function} from 'svelte/internal';
import {formatRange} from './date';

export function writable2(value, mutator, start) {
    return {
        ...writable(mutator ? mutator(value) : value, start),
        mutate: mutator
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
    return derived([locale, format], ([$locale, $format]) => is_function($format)
        ? {format: $format}
        : new Intl.DateTimeFormat($locale, $format)
    );
}

export function intlRange(locale, format) {
    return derived([locale, format], ([$locale, $format]) => {
        if (is_function($format)) {
            return {format: $format};
        }
        let intl = new Intl.DateTimeFormat($locale, $format);
        return {
            format: (start, end) => formatRange(start, end, intl)
        };
    });
}
