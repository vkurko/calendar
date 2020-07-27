import {derived} from 'svelte/store';
import {cloneDate, addDay, subtractDay} from '../../lib/date';

export function days(date, firstDay) {
    return derived([date, firstDay], ([$date, $firstDay]) => {
        let days = [];
        let day = cloneDate($date);
        let max = 7;
        // First day of week
        while (day.getDay() !== $firstDay && max) {
            subtractDay(day);
            --max;
        }
        for (let i = 0; i < 7; ++i) {
            days.push(cloneDate(day));
            addDay(day);
        }

        return days;
    });
}
