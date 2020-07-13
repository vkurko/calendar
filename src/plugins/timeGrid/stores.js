import {derived} from 'svelte/store';
import {addDuration} from '../../lib/date';

export function times(slotDuration, _intlSlotLabel) {
    return derived([slotDuration, _intlSlotLabel], ([$slotDuration, $_intlSlotLabel]) => {
        let compact = $slotDuration.seconds >= 3600;
        let times = [];
        let date = new Date('2020-01-01 00:00:00');
        let end = new Date('2020-01-02 00:00:00');
        let i = 1;
        while (date < end) {
            times.push(times.length && (i || compact) ? $_intlSlotLabel.format(date) : '');
            addDuration(date, $slotDuration);
            i = 1 - i;
        }

        return times;
    });
}
