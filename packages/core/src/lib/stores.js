import {derived} from 'svelte/store';
import {is_function} from 'svelte/internal';
import {toLocalDate} from './date';

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
