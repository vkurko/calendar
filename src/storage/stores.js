import {derived, writable, get} from 'svelte/store';
import {is_function} from 'svelte/internal';
import {cloneDate, addDuration, addDay, subtractDay, setHours, toISOString, formatRange} from '../lib/date';
import {createEvents} from '../lib/events';
import {createView} from '../lib/view';
import {assign} from '../utils';

export function writable2(initValue, mutator, start) {
    let storeValue = is_function(mutator) ? mutator(initValue) : initValue;
    let {set, ...rest} = writable(storeValue, start);
    return {
        set: value => {storeValue = value; set(value);},
        get: () => storeValue,
        mutate: mutator,
        ...rest
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

export function activeRange(date, duration, firstDay) {
    return derived([date, duration, firstDay], ([$date, $duration, $firstDay]) => {
        let start = cloneDate($date);
        if ($duration.inWeeks) {
            let max = 7;
            // First day of week
            while (start.getDay() !== $firstDay && max) {
                subtractDay(start);
                --max;
            }
        }
        let end = addDuration(cloneDate(start), $duration);

        return {start, end};
    });
}

export function viewDates(_activeRange) {
    return derived(_activeRange, ({start, end}) => {
        let dates = [];
        let date = cloneDate(start);
        while (date < end) {
            dates.push(cloneDate(date));
            addDay(date);
        }

        return dates;
    });
}

export function view(view, _activeRange) {
    return derived2([view, _activeRange], args => createView(...args));
}

export function events(events, eventSources, _activeRange, _fetchedRange, lazyFetching, loading) {
    let _events = writable([]);
    let abortController;
    let fetching = 0;
    derived(
        [events, eventSources, _activeRange, _fetchedRange, lazyFetching, loading],
        ([$events, $eventSources, $_activeRange, $_fetchedRange, $lazyFetching, $loading], set) => {
            if (!$eventSources.length) {
                set($events);
                return;
            }
            // Do not fetch if new range is within previous one
            if (!$_fetchedRange.start || $_fetchedRange.start > $_activeRange.start || $_fetchedRange.end < $_activeRange.end || !$lazyFetching) {
                if (abortController) {
                    // Abort previous request
                    abortController.abort();
                }
                // Create new abort controller
                abortController = new AbortController();
                // Call loading hook
                if (is_function($loading) && !fetching) {
                    $loading(true);
                }
                let events = [];
                for (let source of $eventSources) {
                    // Set request params
                    let params = is_function(source.extraParams) ? source.extraParams() : assign({}, source.extraParams);
                    params.start = toISOString($_activeRange.start);
                    params.end = toISOString($_activeRange.end);
                    for (let key of source.url.searchParams.keys()) {
                        source.url.searchParams.delete(key);
                    }
                    for (let [name, value] of Object.entries(params)) {
                        source.url.searchParams.set(name, value);
                    }
                    // For relative URL cut the fake base out
                    fetch(source.url.href.substr(source.urlFrom), {signal: abortController.signal, credentials: 'same-origin'})
                        .then(response => response.json())
                        .then(data => {
                            events = events.concat(createEvents(data));
                            set(events);
                            if (-- fetching === 0 && is_function($loading)) {
                                $loading(false);
                            }
                        })
                        .catch(e => {
                            if (--fetching === 0 && is_function($loading)) {
                                $loading(false);
                            }
                        });
                    ++fetching;
                    // Save current range for future requests
                    $_fetchedRange.start = $_activeRange.start;
                    $_fetchedRange.end = $_activeRange.end;
                }
            }
        },
        []
    ).subscribe(events => _events.set(events));

    return _events;
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

export function theme(theme) {
    return derived(theme, theme => {
        let result = {

        };
        for (let key of Object.keys(result)) {
            if (key in theme) {
                if (is_function(theme[key])) {
                    result[key] = theme[key] ;
                }
                result[key] += ` ${theme[key]}`;
            }
        }
        return result;
    });
}