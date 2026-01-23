import {getAbortSignal, tick, untrack} from 'svelte';
import {
    assign, cloneDate, createDate, createEvents, createResources, datesEqual, empty, isArray, isFunction, setMidnight,
    toISOString, toLocalDate, toViewWithLocalDates
} from '#lib';

export function loadEvents(mainState, loadingInvoker) {
    return () => {
        // Dependencies
        let {activeRange, fetchedRange: {events: fetchedRange}, viewDates,
            options: {events, eventSources, lazyFetching}} = mainState;

        untrack(() => {
            load(
                eventSources.map(source => isFunction(source.events) ? source.events : source),
                events,
                createEvents,
                result => mainState.events = result,
                activeRange,
                fetchedRange,
                viewDates,
                true,
                lazyFetching,
                loadingInvoker
            );
        });
    };
}

export function loadResources(mainState, loadingInvoker) {
    return () => {
        // Dependencies
        let {activeRange, fetchedRange: {resources: fetchedRange}, viewDates,
            options: {lazyFetching, refetchResourcesOnNavigate, resources}} = mainState;

        untrack(() => {
            load(
                isArray(resources) ? [] : [resources],
                resources,
                createResources,
                result => mainState.resources = result,
                activeRange,
                fetchedRange,
                viewDates,
                refetchResourcesOnNavigate,
                lazyFetching,
                loadingInvoker
            );
        });
    };
}

function load(sources, defaultResult, parseResult, applyResult, activeRange, fetchedRange, viewDates, refetchOnNavigate, lazyFetching, loading) {
    if (empty(viewDates)) {
        return;
    }
    if (empty(sources)) {
        applyResult(defaultResult);
        return;
    }
    // Do not fetch if new range is within the previous one
    if (
        (refetchOnNavigate || !fetchedRange.start) &&
        (
            !lazyFetching ||
            !fetchedRange.start ||
            fetchedRange.start > activeRange.start ||
            fetchedRange.end < activeRange.end
        )
    ) {
        let result = [];
        // Prepare handlers
        let failure = e => loading.stop();
        let success = data => {
            result = result.concat(parseResult(data));
            applyResult(result);
            loading.stop();
        };
        // Prepare other stuff
        let startStr = toISOString(activeRange.start)
        let endStr = toISOString(activeRange.end);
        // Loop over event sources
        for (let source of sources) {
            loading.start();
            if (isFunction(source)) {
                // Source as a function
                let result = source(refetchOnNavigate ? {
                    start: toLocalDate(activeRange.start),
                    end: toLocalDate(activeRange.end),
                    startStr,
                    endStr
                } : {}, success, failure);
                if (result !== undefined) {
                    Promise.resolve(result).then(success, failure);
                }
            } else {
                // Source as a JSON feed
                // Prepare params
                let params = isFunction(source.extraParams) ? source.extraParams() : assign({}, source.extraParams);
                if (refetchOnNavigate) {
                    params.start = startStr;
                    params.end = endStr;
                }
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
        }
        // Save current range for future requests
        assign(fetchedRange, activeRange);
    }
}

export function createLoadingInvoker(options) {
    let counter = 0;
    function invoke(value) {
        let {loading} = options;
        if (isFunction(loading)) {
            loading(value);
        }
    }
    return {
        start: () => ++counter === 1 && invoke(true),
        stop: () => --counter === 0 && invoke(false)
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
