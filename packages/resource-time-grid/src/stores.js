import {derived} from 'svelte/store';

export function viewResources(state) {
    return derived(
        [state.resources, state.filterResourcesWithEvents, state._events, state._activeRange],
        ([$resources, $filterResourcesWithEvents, $_events, $_activeRange]) => {
            let result = $resources;

            if ($filterResourcesWithEvents) {
                result = $resources.filter(resource => {
                    for (let event of $_events) {
                        if (
                            event.display !== 'background' &&
                            event.resourceIds.includes(resource.id) &&
                            event.start < $_activeRange.end &&
                            event.end > $_activeRange.start
                        ) {
                            return true;
                        }
                    }
                    return false;
                });
            }

            if (!result.length) {
                result = state.resources.parse([{}]);
            }

            return result;
        }
    );
}