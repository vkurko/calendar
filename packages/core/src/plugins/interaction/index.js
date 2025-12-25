import {assign} from '#lib';
import Auxiliary from './Auxiliary.svelte';

export default {
    createOptions(options) {
        assign(options, {
            dateClick: undefined,
            dragConstraint: undefined,
            dragScroll: true,
            editable: false,
            eventDragMinDistance: 5,
            eventDragStart: undefined,
            eventDragStop: undefined,
            eventDrop: undefined,
            eventDurationEditable: true,
            eventLongPressDelay: undefined,
            eventResizableFromStart: false,
            eventResizeStart: undefined,
            eventResizeStop: undefined,
            eventResize: undefined,
            eventStartEditable: true,
            longPressDelay: 1000,
            pointer: false,
            resizeConstraint: undefined,
            select: undefined,
            selectBackgroundColor: undefined,  // ec option
            selectConstraint: undefined,
            selectLongPressDelay: undefined,
            selectMinDistance: 5,
            snapDuration: undefined,
            unselect: undefined,
            unselectAuto: true,
            unselectCancel: ''
        });
        assign(options.theme, {
            draggable: 'ec-draggable',
            ghost: 'ec-ghost',
            preview: 'ec-preview',
            pointer: 'ec-pointer',
            resizer: 'ec-resizer',
            start: 'ec-start',
            dragging: 'ec-dragging',
            resizingY: 'ec-resizing-y',
            resizingX: 'ec-resizing-x',
            selecting: 'ec-selecting'
        });
    },

    initState(mainState) {
        mainState.auxComponents.push(Auxiliary);
    }
}
