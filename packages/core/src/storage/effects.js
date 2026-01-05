import {getAbortSignal, tick, untrack} from 'svelte';
import {
    assign, cloneDate, createDate, createEvents, datesEqual, isFunction, setMidnight, toISOString, toLocalDate,
    toViewWithLocalDates
} from '#lib';

export function loadEvents(mainState) {
    let fetching = 0;
    return () => {
        // Dependencies
        let {activeRange, fetchedRange, options: {events, eventSources, lazyFetching, loading}} = mainState;

        untrack(() => {
            if (!eventSources.length) {
                mainState.events = events;
            }
            // Do not fetch if new range is within the previous one
            if (
                !fetchedRange.start ||
                fetchedRange.start > activeRange.start ||
                fetchedRange.end < activeRange.end ||
                !lazyFetching
            ) {
                // Call loading hook
                if (isFunction(loading) && !fetching) {
                    loading(true);
                }
                let stopLoading = () => {
                    if (--fetching === 0 && isFunction(loading)) {
                        loading(false);
                    }
                };
                let events = [];
                // Prepare handlers
                let failure = e => stopLoading();
                let success = data => {
                    events = events.concat(createEvents(data));
                    mainState.events = events;
                    stopLoading();
                };
                // Prepare other stuff
                let startStr = toISOString(activeRange.start)
                let endStr = toISOString(activeRange.end);
                // Loop over event sources
                for (let source of eventSources) {
                    if (isFunction(source.events)) {
                        // Events as a function
                        let result = source.events({
                            start: toLocalDate(activeRange.start),
                            end: toLocalDate(activeRange.end),
                            startStr,
                            endStr
                        }, success, failure);
                        if (result !== undefined) {
                            Promise.resolve(result).then(success, failure);
                        }
                    } else {
                        // Events as a JSON feed
                        // Prepare params
                        let params = isFunction(source.extraParams) ? source.extraParams() : assign({}, source.extraParams);
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
                        fetch(url, {
                            method: source.method, headers, body, signal: getAbortSignal(), credentials: 'same-origin'
                        })
                            .then(response => response.json())
                            .then(success)
                            .catch(failure);
                    }
                    ++fetching;
                }
                // Save current range for future requests
                assign(fetchedRange, activeRange);
            }
        });
    };
}

export function setNowAndToday(mainState) {
    return () => {
        // Now and today
        let interval = setInterval(() => {
            let now = createDate();
            let today = setMidnight(cloneDate(now));
            mainState.now = now;
            if (!datesEqual(mainState.today, today)) {
                mainState.today = today;
            }
        }, 1000);

        return () => clearInterval(interval);
    }
}

export function runDatesSet(mainState) {
    return () => {
        // Dependencies
        let {activeRange, options: {datesSet}} = mainState;

        untrack(() => {
            if (isFunction(datesSet)) {
                datesSet({
                    start: toLocalDate(activeRange.start),
                    end: toLocalDate(activeRange.end),
                    startStr: toISOString(activeRange.start),
                    endStr: toISOString(activeRange.end),
                    view: toViewWithLocalDates(mainState.view)
                });
            }
        });
    }
}

export function runEventAllUpdated(mainState) {
    let timer;
    return () => {
        // Dependencies
        let {filteredEvents, options: {eventAllUpdated}} = mainState;

        untrack(() => {
            if (isFunction(eventAllUpdated)) {
                if (!timer) {
                    timer = setTimeout(() => {
                        timer = null;
                        eventAllUpdated({view: toViewWithLocalDates(mainState.view)});
                    });
                }
            }
        });
    }
}

export function runViewDidMount(mainState) {
    return () => {
        // Dependencies
        let {options: {view, viewDidMount}} = mainState;

        untrack(() => {
            if (isFunction(viewDidMount)) {
                tick().then(() => viewDidMount({
                    view: toViewWithLocalDates(mainState.view)
                }));
            }
        });
    };
}
