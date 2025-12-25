import {bgEvent, helperEvent, listen} from '#lib';
import {eventDraggable} from './lib';

export function setIClasses(mainState) {
    return () => {
        // Dependencies
        let {options: {editable, eventStartEditable, theme}} = mainState;

        mainState.iClasses = (classNames, event) => {
            let {display} = event;
            return [
                ...classNames,
                helperEvent(display)
                    ? [theme[display]]
                    : (
                        !bgEvent(display) && eventDraggable(event, eventStartEditable, editable)
                            ? [theme.draggable]
                            : []
                    )
            ];
        };
    };
}

export function handleScroll(mainState) {
    return () => {
        // Dependencies
        let {interaction, mainEl} = mainState;

        if (mainEl) {
            return listen(mainEl, 'scroll', () => {
                interaction.action.handleScroll();
                interaction.pointer?.handleScroll();
            });
        }
    };
}
