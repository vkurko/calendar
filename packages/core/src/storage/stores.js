import {derived, writable, get} from 'svelte/store';
import {is_function, tick} from 'svelte/internal';
import {cloneDate, addDuration, addDay, subtractDay, toISOString, formatRange, nextClosestDay, prevClosestDay} from '@event-calendar/common';
import {createEvents} from '@event-calendar/common';
import {createView} from '@event-calendar/common';
import {assign} from '@event-calendar/common';

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

export function activeRange(state) {
    return derived(
        [state._currentRange, state.monthMode, state.firstDay],
        ([$_currentRange, $monthMode, $firstDay]) => {
            let start = cloneDate($_currentRange.start);
            let end = cloneDate($_currentRange.end);

            if ($monthMode) {
                // First day of week
                prevClosestDay(start, $firstDay);
                nextClosestDay(end, $firstDay);
            }

            return {start, end};
        }
    );
}

export function currentRange(state) {
    return derived(
        [state.date, state.duration, state.monthMode, state.firstDay],
        ([$date, $duration, $monthMode, $firstDay]) => {
            let start = cloneDate($date), end;
            if ($monthMode) {
                start.setDate(1);
            } else if ($duration.inWeeks) {
                // First day of week
                prevClosestDay(start, $firstDay);
            }
            end = addDuration(cloneDate(start), $duration);

            return {start, end};
        }
    );
}

export function viewDates(state) {
    return derived(state._activeRange, ({start, end}) => {
        let dates = [];
        let date = cloneDate(start);
        while (date < end) {
            dates.push(cloneDate(date));
            addDay(date);
        }

        return dates;
    });
}

export function viewTitle(state) {
    return derived(
        [state.date, state._activeRange, state._titleIntlRange, state.monthMode],
        ([$date, $_activeRange, $_titleIntlRange, $monthMode]) => {
            return $monthMode
                ? $_titleIntlRange.format($date, $date)
                : $_titleIntlRange.format($_activeRange.start, subtractDay(cloneDate($_activeRange.end)));
        }
    );
}

export function view(state) {
    return derived2([state.view, state._viewTitle, state._currentRange, state._activeRange], args => createView(...args));
}

export function events(state) {
    let _events = writable([]);
    let abortController;
    let fetching = 0;
    derived(
        [state.events, state.eventSources, state._activeRange, state._fetchedRange, state.lazyFetching, state.loading],
        (values, set) => tick().then(() => {
            let [$events, $eventSources, $_activeRange, $_fetchedRange, $lazyFetching, $loading] = values;
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
                            if (--fetching === 0 && is_function($loading)) {
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
        }),
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
