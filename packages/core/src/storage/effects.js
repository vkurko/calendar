import {getAbortSignal, tick, untrack} from 'svelte';
import {
    addDay,
    applyOffsetDiff, assign, cloneDate, createDate, createEvents, createResources, datesEqual, empty, getOffset, isArray,
    isFunction, setMidnight, setOffset, toISOString, toLocalDate, toViewWithLocalDates
} from '#lib';
import {arrayProxy} from './proxy.svelte.js';

export function switchView(mainState) {
    return () => {
        // Dependencies
        let {options: {view}} = mainState;

        untrack(() => {
            let initComponent = mainState.setViewOptions(view);
            mainState.extensions = {};
            mainState.features = [];
            mainState.viewComponent = initComponent(mainState);
        });
    };
}

export function loadEvents(mainState, loadingInvoker) {
    return () => {
        // Dependencies
        let {activeRange, fetchedRange: {events: fetchedRange}, offset, viewDates,
            options: {events, eventSources, lazyFetching, timeZone}} = mainState;

        untrack(() => {
            load(
                eventSources.map(source => isFunction(source.events) ? source.events : source),
                events,
                input => createEvents(input, offset),
                result => mainState.events = arrayProxy(result),
                timeZone,
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
            options: {lazyFetching, refetchResourcesOnNavigate, resources, timeZone}} = mainState;

        untrack(() => {
            load(
                isArray(resources) ? [] : [resources],
                resources,
                createResources,
                result => mainState.resources = arrayProxy(result),
                timeZone,
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

function load(
    sources,
    defaultResult,
    parseResult,
    applyResult,
    timeZone,
    activeRange,
    fetchedRange,
    viewDates,
    refetchOnNavigate,
    lazyFetching,
    loading
) {
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
            fetchedRange.end < activeRange.end ||
            fetchedRange.timeZone !== timeZone
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
                    endStr,
                    timeZone
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
                    if (timeZone !== 'local') {
                        params.timeZone = timeZone;
                    }
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
        assign(fetchedRange, {...activeRange, timeZone});
    }
}

export function createLoadingInvoker(mainState) {
    let counter = 0;
    function invoke(value) {
        let {options: {loading}} = mainState;
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
        // Dependencies
        let {offset} = mainState;

        // Now and today
        let interval = setInterval(() => {
            let now = createDate(undefined, offset);
            let today = setMidnight(cloneDate(now));
            mainState.now = now;
            if (!datesEqual(mainState.today, today)) {
                mainState.today = today;
            }
        }, 1000);

        return () => clearInterval(interval);
    }
}

export function handleTimeZoneChange(mainState) {
    return () => {
        // Dependencies
        let {offset, options} = mainState;

        untrack(() => {
            // Update events
            for (let event of mainState.events) {
                if (!event.allDay) {
                    for (let prop of ['start', 'end']) {
                        let dateOffset = getOffset(event[prop]);
                        // Dates parsed from strings with no timezone info have dateOffset === undefined;
                        // they are treated as floating and only get branded with the new offset, not shifted
                        if (dateOffset !== undefined) {
                            applyOffsetDiff(event[prop], offset - dateOffset);
                        }
                        setOffset(event[prop], offset);
                    }
                }
            }
            // Update date option
            let dateOffset = getOffset(options.date);
            if (dateOffset !== undefined) {
                let diff = createDate(undefined, offset).getUTCDay() - createDate(undefined, dateOffset).getUTCDay();
                let date = addDay(cloneDate(options.date), diff);
                mainState.setOption('date', date);
            }
            setOffset(options.date, offset);
        });
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
