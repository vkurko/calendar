import {bgEvent, helperEvent} from '#lib';

export function eventDraggable(event, $eventStartEditable, $editable) {
    return (event.startEditable ?? $eventStartEditable ?? event.editable ?? $editable);
}

export function eventResizable(event, $eventDurationEditable, $editable) {
    return (event.durationEditable ?? $eventDurationEditable ?? event.editable ?? $editable);
}
