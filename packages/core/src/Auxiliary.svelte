<script>
    import {getContext, untrack} from 'svelte';
    import {
        toISOString, toLocalDate, toViewWithLocalDates, isFunction, task, flushDebounce
    } from '#lib';

    let {
        datesSet, eventAllUpdated, _auxiliary, _activeRange, _filteredEvents, _tasks, _queue, _view
    } = getContext('state');

    // datesSet callback
    $effect(() => {
        $_activeRange;
        untrack(() => {
            if (isFunction($datesSet)) {
                $datesSet({
                    start: toLocalDate($_activeRange.start),
                    end: toLocalDate($_activeRange.end),
                    startStr: toISOString($_activeRange.start),
                    endStr: toISOString($_activeRange.end),
                    view: toViewWithLocalDates($_view)
                });
            }
        });
    });

    // eventAllUpdated callback
    $effect(() => {
        $_filteredEvents;
        untrack(() => {
            if (isFunction($eventAllUpdated)) {
                task(() => $eventAllUpdated({view: toViewWithLocalDates($_view)}), 'eau', _tasks);
            }
        });
    });

    $effect(() => {
        $_queue;
        untrack(() => {
            flushDebounce($_queue);
        });
    });
</script>

{#each $_auxiliary as Component}
    <Component/>
{/each}
