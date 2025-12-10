import {derived} from 'svelte/store';
import {createResources, eventIntersects, getPayload} from '#lib';

function viewResources(state) {
    return derived(
        [state.resources, state.filterResourcesWithEvents, state._filteredEvents, state._activeRange],
        ([$resources, $filterResourcesWithEvents, $_filteredEvents, $_activeRange]) => {
            let result = $resources.filter(resource => !getPayload(resource).hidden);

            if ($filterResourcesWithEvents) {
                result = $resources.filter(
                    resource => $_filteredEvents.some(
                        event => eventIntersects(event, $_activeRange.start, $_activeRange.end, resource)
                    )
                );
            }

            if (!result.length) {
                result = createResources([{}]);
            }

            return result;
        }
    );
}

/**
 * ResourceTimeGrid + ResourceTimeline
 */
export function createRRStores(state) {
    if (!('_viewResources' in state)) {
        state._viewResources = viewResources(state);
    }
}
