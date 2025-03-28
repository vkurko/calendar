import {writable} from 'svelte/store';
import {noop} from '@event-calendar/core';
import Auxiliary from './Auxiliary.svelte';

export default {
    createOptions(options) {
        options.allowMutlidayResize = true;
        options.dateClick = undefined;
        options.dragScroll = true;
        options.editable = false;
        options.eventDragMinDistance = 5;
        options.eventDragStart = undefined;
        options.eventDragStop = undefined;
        options.eventDrop = undefined;
        options.eventDurationEditable = true;
        options.eventLongPressDelay = undefined;
        options.eventResizableFromStart = false;
        options.eventResizeStart = undefined;
        options.eventResizeStop = undefined;
        options.eventResize = undefined;
        options.eventStartEditable = true;
        options.longPressDelay = 1000;
        options.pointer = false;
        options.select = undefined;
        options.selectBackgroundColor = undefined;  // ec option
        options.selectLongPressDelay = undefined;
        options.selectMinDistance = 5;
        options.unselect = undefined;
        options.unselectAuto = true;
        options.unselectCancel = '';
        options.theme.draggable = 'ec-draggable';
        options.theme.ghost = 'ec-ghost';
        options.theme.preview = 'ec-preview';
        options.theme.pointer = 'ec-pointer';
        options.theme.resizer = 'ec-resizer';
        options.theme.start = 'ec-start';
        options.theme.dragging = 'ec-dragging';
        options.theme.resizingY = 'ec-resizing-y';
        options.theme.resizingX = 'ec-resizing-x';
        options.theme.selecting = 'ec-selecting';
    },

    createStores(state) {
        state._draggable = writable(noop);
        state._auxiliary.update($_auxiliary => [...$_auxiliary, Auxiliary]);
    }
}
