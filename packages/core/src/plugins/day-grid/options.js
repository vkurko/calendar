import {assign} from '#lib';

/**
 * DayGrid + ResourceTimeline
 */
export function createDROptions(options) {
    if (!('weekNumbers' in options)) {
        assign(options, {
            weekNumbers: false,
            weekNumberContent: undefined
        });
    }
}
