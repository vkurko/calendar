import {derived, writable, readable} from 'svelte/store';
import {is_function} from 'svelte/internal';
import {
    DAY_IN_SECONDS,
    assign,
    cloneDate,
    createDate,
    createEvents,
    createView,
    addDuration,
    addDay,
    derived2,
    subtractDay,
    toISOString,
    nextClosestDay,
    prevClosestDay,
    setMidnight,
    toLocalDate,
    debounce
} from '../lib.js';

export function monthMode(state) {
    return derived(state.view, $view => $view.startsWith?.('dayGrid'));
}

export function activeRange(state) {
    return derived(
        [state._currentRange, state.firstDay, state.slotMaxTime, state._monthMode],
        ([$_currentRange, $firstDay, $slotMaxTime, $_monthMode]) => {
            let start = cloneDate($_currentRange.start);
            let end = cloneDate($_currentRange.end);

            if ($_monthMode) {
                // First day of week
                prevClosestDay(start, $firstDay);
                nextClosestDay(end, $firstDay);
            } else if ($slotMaxTime.days || $slotMaxTime.seconds > DAY_IN_SECONDS) {
                addDuration(subtractDay(end), $slotMaxTime);
                let start2 = subtractDay(cloneDate(end));
                if (start2 < start) {
                    start = start2;
                }
            }

            return {start, end};
        }
    );
}

export function currentRange(state) {
    return derived(
        [state.date, state.duration, state.firstDay, state._monthMode],
        ([$date, $duration, $firstDay, $_monthMode]) => {
            let start = cloneDate($date), end;
            if ($_monthMode) {
                start.setUTCDate(1);
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
    return derived2([state._activeRange, state.hiddenDays], ([$_activeRange, $hiddenDays]) => {
        let dates = [];
        let date = setMidnight(cloneDate($_activeRange.start));
        let end = setMidnight(cloneDate($_activeRange.end));
        while (date < end) {
            if (!$hiddenDays.includes(date.getUTCDay())) {
                dates.push(cloneDate(date));
            }
            addDay(date);
        }
        if (!dates.length && $hiddenDays.length && $hiddenDays.length < 7) {
            // Try to move the date
            state.date.update(date => {
                while ($hiddenDays.includes(date.getUTCDay())) {
                    addDay(date);
                }
                return date;
            });
            dates = state._viewDates.get();
        }

        return dates;
    });
}

export function viewTitle(state) {
    return derived(
        [state.date, state._activeRange, state._titleIntlRange, state._monthMode],
        ([$date, $_activeRange, $_titleIntlRange, $_monthMode]) => {
            return $_monthMode
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
    let debounceHandle = {};
    derived(
        [state.events, state.eventSources, state._activeRange, state._fetchedRange, state.lazyFetching, state.loading],
        (values, set) => debounce(() => {
            let [$events, $eventSources, $_activeRange, $_fetchedRange, $lazyFetching, $loading] = values;
            if (!$eventSources.length) {
                set($events);
                return;
            }
            // Do not fetch if new range is within the previous one
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
                let stopLoading = () => {
                    if (--fetching === 0 && is_function($loading)) {
                        $loading(false);
                    }
                };
                let events = [];
                // Prepare handlers
                let failure = e => stopLoading();
                let success = data => {
                    events = events.concat(createEvents(data));
                    set(events);
                    stopLoading();
                };
                // Prepare other stuff
                let startStr = toISOString($_activeRange.start)
                let endStr = toISOString($_activeRange.end);
                // Loop over event sources
                for (let source of $eventSources) {
                    if (is_function(source.events)) {
                        // Events as a function
                        let result = source.events({
                            start: toLocalDate($_activeRange.start),
                            end: toLocalDate($_activeRange.end),
                            startStr,
                            endStr
                        }, success, failure);
                        if (result !== undefined) {
                            Promise.resolve(result).then(success, failure);
                        }
                    } else {
                        // Events as a JSON feed
                        // Prepare params
                        let params = is_function(source.extraParams) ? source.extraParams() : assign({}, source.extraParams);
                        params.start = startStr;
                        params.end = endStr;
                        params = new URLSearchParams(params);
                        // Prepare fetch
                        let url = source.url, headers = {}, body;
                        if (['GET', 'HEAD'].includes(source.method)) {
                            url += (url.includes('?') ? '&' : '?') + params;
                        } else {
                            headers['content-type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
                            body = String(params);  // Safari 10.1 doesn't convert to string automatically
                        }
                        // Do the fetch
                        fetch(url, {method: source.method, headers, body, signal: abortController.signal, credentials: 'same-origin'})
                            .then(response => response.json())
                            .then(success)
                            .catch(failure);
                    }
                    ++fetching;
                }
                // Save current range for future requests
                $_fetchedRange.start = $_activeRange.start;
                $_fetchedRange.end = $_activeRange.end;
            }
        }, debounceHandle, state._queue),
        []
    ).subscribe(_events.set);

    return _events;
}

export function now() {
    return readable(createDate(), set => {
        let interval = setInterval(() => {
            set(createDate());
        }, 1000);

        return () => clearInterval(interval);
    });
}

export function today(state) {
    return derived(state._now, $_now => setMidnight(cloneDate($_now)));
}
