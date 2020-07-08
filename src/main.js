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
	};

	getOption(name) {
		return this.cal.getOption(name);
	};
};