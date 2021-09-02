import Interaction from './Interaction.svelte';

export default {
	createOptions(options) {
		options.editable = false;
		options.eventStartEditable = true;
		options.eventDragMinDistance = 5;
		options.eventDragStart = undefined;
		options.eventDragStop = undefined;
		options.eventDrop = undefined;
		options.dragScroll = true;
		options.pointer = false;
		options.theme.draggable = 'ec-draggable';
		options.theme.ghost = 'ec-ghost';
		options.theme.preview = 'ec-preview';
		options.theme.pointer = 'ec-pointer';
	},

	createStores(state) {
		state._interaction.set({component: Interaction});
	}
}
