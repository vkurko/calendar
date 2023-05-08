import View from './View.svelte';
import Auxiliary from './Auxiliary.svelte';

export default {
	createOptions(options) {
		options.resources = [];
		options.datesAboveResources = false;
		options.filterResourcesWithEvents = false;
		options.resourceLabelContent = undefined;
		options.resourceLabelDidMount = undefined;
		// Common options
		options.buttonText.resourceTimeGridDay = 'day';
		options.buttonText.resourceTimeGridWeek = 'week';
		options.theme.resource = 'ec-resource';
		options.theme.resourceTitle = 'ec-resource-title';
		options.view = 'resourceTimeGridWeek';
		options.views.resourceTimeGridDay = {
			component: View,
			duration: {days: 1}
		};
		options.views.resourceTimeGridWeek = {
			component: View,
			duration: {weeks: 1}
		};
	},

	createParsers(parsers, options) {
		parsers.resources = createResources;
	},

	createStores(state) {
		state._auxiliary.update($_auxiliary => [...$_auxiliary, Auxiliary]);
	}
}

function createResources(input) {
	return input.map(resource => ({
		id: String(resource.id),
		title: resource.title || '',
		titleHTML: resource.titleHTML || '',
		eventBackgroundColor: resource.eventBackgroundColor,
        eventTextColor: resource.eventTextColor
	}));
}
