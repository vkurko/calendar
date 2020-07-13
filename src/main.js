import Calendar from './Calendar.svelte';
import TimeGrid from './plugins/timeGrid/plugin';
import ResourceTimeGrid from './plugins/resourceTimeGrid/plugin';

export default class {
	constructor(el, options) {
		options.plugins = [TimeGrid, ResourceTimeGrid];
		this.cal = new Calendar({
			target: el,
			props: {
				options
			}
		});
	}

	setOption(name, value) {
		this.cal.setOption(name, value);
		return this;
	}

	getOption(name) {
		return this.cal.getOption(name);
	}

	refetchEvents() {
		this.cal.refetchEvents();
		return this;
	}

	addEvent(event) {
		this.cal.addEvent(event);
		return this;
	}

	updateEvent(event, create) {
		this.cal.updateEvent(event, create);
		return this;
	}

	removeEvent(eventId) {
		this.cal.removeEvent(eventId);
		return this;
	}
};