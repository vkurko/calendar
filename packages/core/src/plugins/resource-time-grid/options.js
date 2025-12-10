/**
 * ResourceTimeGrid + ResourceTimeline
 */
export function createRROptions(options) {
    if (!('resourceLabelContent' in options)) {
        options.filterResourcesWithEvents = false;
        options.resourceLabelContent = undefined;
        options.resourceLabelDidMount = undefined;
    }
}
