import {untrack} from 'svelte';
import {isFunction} from './utils.js';
import {cloneDate, copyTime, toLocalDate} from './date.js';

export function intl(mainState, option) {
    return () => {
        // Dependencies
        let {options: {locale}} = mainState;
        let format = mainState.options[option];

        let intl;

        untrack(() => {
            intl = isFunction(format)
                ? {format}
                : new Intl.DateTimeFormat(locale, format);
        });

        return {
            format: date => intl.format(toLocalDate(date))
        };
    };
}

/**
 * @param mainState
 * @param option
 * @param timeOnly  Make the native formatter output only the time part of the range, even if the dates differ.
 *                  A formatting function always gets the actual dates.
 */
export function intlRange(mainState, option, timeOnly = false) {
    return () => {
        // Dependencies
        let {options: {locale}} = mainState;
        let format = mainState.options[option];

        let formatRange;

        untrack(() => {
            if (isFunction(format)) {
                formatRange = (start, end) => format(toLocalDate(start), end && toLocalDate(end));
            } else {
                let intl = new Intl.DateTimeFormat(locale, format);
                formatRange = (start, end) => {
                    if (!end) {
                        return intl.format(toLocalDate(start));
                    }
                    if (timeOnly) {
                        // Move the end to the start day, so that the dates are not output
                        end = copyTime(cloneDate(start), end);
                    }
                    start = toLocalDate(start);
                    end = toLocalDate(end);
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
        });

        return {formatRange};
    };
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
