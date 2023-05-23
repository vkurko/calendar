import {derived} from 'svelte/store';
import {cloneDate, addDay, subtractDay} from '@event-calendar/core';

export function days(state) {
    return derived([state.date, state.firstDay, state.hiddenDays], ([$date, $firstDay, $hiddenDays]) => {
        let days = [];
        let day = cloneDate($date);
        let max = 7;
        // First day of week
        while (day.getUTCDay() !== $firstDay && max) {
            subtractDay(day);
            --max;
        }
        for (let i = 0; i < 7; ++i) {
            if (!$hiddenDays.includes(day.getUTCDay())) {
                days.push(cloneDate(day));
            }
            addDay(day);
        }

        return days;
    });
}
