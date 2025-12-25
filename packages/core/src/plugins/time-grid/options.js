import {assign, createDuration} from '#lib';

/**
 * TimeGrid + ResourceTimeGrid + ResourceTimeline
 */
export function createTRROptions(options) {
    if (!('scrollTime' in options)) {
        assign(options, {
            columnWidth: undefined,  // ec option
            flexibleSlotTimeLimits: false,  // ec option
            nowIndicator: false,
            scrollTime: '06:00:00',
            slotDuration: '00:30:00',
            slotHeight: 24,  // ec option
            slotLabelInterval: undefined,
            slotLabelFormat: {
                hour: 'numeric',
                minute: '2-digit'
            },
            slotMaxTime: '24:00:00',
            slotMinTime: '00:00:00',
            snapDuration: undefined
        });
        assign(options.theme, {
            nowIndicator: 'ec-now-indicator',
            sidebar: 'ec-sidebar',
            slot: 'ec-slot',
        });
    }
}

/**
 * TimeGrid + ResourceTimeGrid
 */
export function createTROptions(options) {
    if (!('allDaySlot' in options)) {
        assign(options, {
            allDayContent: undefined,
            allDaySlot: true,
            slotEventOverlap: true
        });
        assign(options.theme, {
            allDay: 'ec-all-day'
        });
    }
}

/**
 * TimeGrid + ResourceTimeGrid + ResourceTimeline
 */
export function createTRRParsers(parsers) {
    if (!('scrollTime' in parsers)) {
        assign(parsers, {
            scrollTime: createDuration,
            slotDuration: createDuration,
            slotLabelInterval: input => input !== undefined ? createDuration(input) : undefined,
            slotMaxTime: createDuration,
            slotMinTime: createDuration,
            snapDuration: input => input !== undefined ? createDuration(input) : undefined
        });
    }
}
