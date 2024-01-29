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
        let formatRange;
        if (is_function($format)) {
            formatRange = $format;
        } else {
            let intl = new Intl.DateTimeFormat($locale, $format);
            formatRange = (start, end) => {
                if (start <= end) {
                    return intl.formatRange(start, end);
                } else {
                    // In iOS 16 and older, intl.formatRange() throws an exception if the start date is later than the end date.
                    // Therefore, we first swap the parameters, and then swap the resulting parts.
                    /** @see https://github.com/vkurko/calendar/issues/227 */
                    let parts = intl.formatRangeToParts(end, start);
                    let result = '';
                    let sources = ['startRange', 'endRange'];
                    let processed = [false, false];
                    for (let part of parts) {
                        let i = sources.indexOf(part.source);
                        if (i >= 0) {
                            if (!processed[i]) {
                                result += _getParts(sources[1 - i], parts);
                                processed[i] = true;
                            }
                        } else {
                            result += part.value;
                        }
                    }
                    return result;
                }
            };
        }
        return {
            formatRange: (start, end) => formatRange(toLocalDate(start), toLocalDate(end))
        };
    });
}

function _getParts(source, parts) {
    let result = '';
    for (let part of parts) {
        if (part.source == source) {
            result += part.value;
        }
    }
    return result;
}
