import {
    addDay, addDuration, cloneDate, datesEqual, outsideRange
} from '#lib';

export function createGrid($_viewDates, $_viewResources, $_slotTimeLimits, $datesAboveResources, $validRange, $highlightedDates) {
    let grid = [];
    let gridColumn = 1;
    let loop = $datesAboveResources ? [$_viewDates, $_viewResources] : [$_viewResources, $_viewDates];
    for (let item0 of loop[0]) {
        let days = [];
        for (let item1 of loop[1]) {
            let date = $datesAboveResources ? item0 : item1;
            let resource =  $datesAboveResources ? item1 : item0;
            days.push({
                gridColumn,
                gridRow: 1,
                resource,
                start: addDuration(cloneDate(date), $_slotTimeLimits.min),
                end: addDuration(cloneDate(date), $_slotTimeLimits.max),
                dayStart: date,
                dayEnd: addDay(cloneDate(date)),
                disabled: outsideRange(date, $validRange),
                highlight: $highlightedDates.some(d => datesEqual(d, date))
            });
            ++ gridColumn;
        }
        grid.push(days);
    }

    return grid;
}
