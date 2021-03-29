import Interaction from './Interaction.svelte';

export default {
	createOptions(options) {
		options.editable = false;
		options.eventStartEditable = true;
		options.eventDragStart = undefined;
		options.eventDragStop = undefined;
		options.eventDrop = undefined;
		options.dragScroll = true;
		options.theme.draggable = 'ec-draggable';
		options.theme.ghost = 'ec-ghost';
		options.theme.preview = 'ec-preview';
	},

	createStores(state) {
		state._interactionComponent.set(Interaction);
	}
}
