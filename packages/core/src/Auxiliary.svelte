<script>
    import {getContext} from 'svelte';
    import {debounce, toISOString, toLocalDate, toViewWithLocalDates, isFunction} from './lib.js';

    let {datesSet, _auxiliary, _activeRange, _queue, _view} = getContext('state');

    // Set up datesSet callback
    $: runDatesSet($_activeRange);

    let debounceHandle = {};
    function runDatesSet(_activeRange) {
        if (isFunction($datesSet)) {
            debounce(() => $datesSet({
                start: toLocalDate(_activeRange.start),
                end: toLocalDate(_activeRange.end),
                startStr: toISOString(_activeRange.start),
                endStr: toISOString(_activeRange.end),
                view: toViewWithLocalDates($_view)
            }), debounceHandle, _queue);
        }
    }
</script>

{#each $_auxiliary as component}
    <svelte:component this={component} />
{/each}
