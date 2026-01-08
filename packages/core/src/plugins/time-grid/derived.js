import {untrack} from 'svelte';
import {
    addDay, addDuration, bgEvent, ceil, cloneDate, createAllDayChunks, createDate, createSlots, createSlotTimeLimits,
    datesEqual, outsideRange, prepareAllDayChunks, setMidnight, toSeconds
} from '#lib';
import {createChunks, groupChunks} from './lib.js';

export function grid(mainState, viewState) {
    return () => {
        // Dependencies
        let {viewDates, options: {highlightedDates, validRange}} = mainState;
        let {slotTimeLimits} = viewState;

        let days = [];

        untrack(() => {
            let gridColumn = 1;
            for (let date of viewDates) {
                days.push({
                    gridColumn,
                    gridRow: 1,
                    resource: undefined,
                    start: addDuration(cloneDate(date), slotTimeLimits.min),
                    end: addDuration(cloneDate(date), slotTimeLimits.max),
                    dayStart: date,
                    dayEnd: addDay(cloneDate(date)),
                    disabled: outsideRange(date, validRange),
                    highlight: highlightedDates.some(d => datesEqual(d, date))
                });
                ++gridColumn;
            }
        });

        return [days];
    };
}

export function eventChunks(mainState, viewState) {
    return () => {
        // Dependencies
        let {filteredEvents} = mainState;
        let {grid} = viewState;

        let chunks = [];
        let bgChunks = [];
        let allDayChunks = [];
        let allDayBgChunks = [];

        untrack(() => {
            for (let event of filteredEvents) {
                for (let days of grid) {
                    if (bgEvent(event.display)) {
                        bgChunks = bgChunks.concat(createChunks(event, days));
                        if (event.allDay) {
                            allDayBgChunks = allDayBgChunks.concat(createAllDayChunks(event, days));
                        }
                    } else {
                        if (event.allDay) {
                            allDayChunks = allDayChunks.concat(createAllDayChunks(event, days));
                        } else {
                            chunks = chunks.concat(createChunks(event, days));
                        }
                    }
                }
            }
            groupChunks(chunks);
            prepareAllDayChunks(allDayChunks);
        });

        return {chunks, bgChunks, allDayChunks, allDayBgChunks};
    };
}

export function iEventChunks(mainState, viewState) {
    return () => {
        // Dependencies
        let {iEvents} = mainState;
        let {grid} = viewState;

        let iChunks = [];
        let allDayIChunks = [];

        for (let [, event] of iEvents) {
            if (!event) {
                continue;
            }
            untrack(() => {
                for (let days of grid) {
                    if (event.allDay) {
                        allDayIChunks = allDayIChunks.concat(createAllDayChunks(event, days, false));
                    } else {
                        iChunks = iChunks.concat(createChunks(event, days, false));
                    }
                }
            });
        }

        return {iChunks, allDayIChunks};
    };
}

export function slotTimeLimits(mainState) {
    return () => {
        // Dependencies
        let {filteredEvents, viewDates, options: {flexibleSlotTimeLimits, slotMinTime, slotMaxTime}} = mainState;

        let limits;

        untrack(() => {
            limits = createSlotTimeLimits(slotMinTime, slotMaxTime, flexibleSlotTimeLimits, viewDates, filteredEvents);
        });

        return limits;
    };
}

export function slotLabelPeriodicity(mainState) {
    return () => {
        // Dependencies
        let {options: {slotDuration, slotLabelInterval}} = mainState;

        let periodicity;

        untrack(() => {
            periodicity = slotLabelInterval === undefined
                ? toSeconds(slotDuration) < 3600 ? 2 : 1
                : (ceil(toSeconds(slotLabelInterval) / toSeconds(slotDuration)) || 1)
        });

        return periodicity;
    };
}

export function slots(mainState, viewState) {
    return () => {
        // Dependencies
        let {options: {slotDuration}} = mainState;
        let {intlSlotLabel, slotLabelPeriodicity, slotTimeLimits} = viewState;

        let slots;

        untrack(() => {
            slots = createSlots(setMidnight(createDate()), slotDuration, slotLabelPeriodicity, slotTimeLimits, intlSlotLabel);
        });

        return slots;
    };
}

export function snap(mainState) {
    return () => {
        // Dependencies
        let {options: {slotDuration, snapDuration}} = mainState;

        snapDuration ??= slotDuration;

        return {
            duration: snapDuration,
            ratio: toSeconds(snapDuration) / toSeconds(slotDuration)
        };
    };
}
