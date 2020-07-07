import Calendar from './Calendar.svelte';
import TimeGrid from './plugins/timeGrid/plugin';

export default class {
	constructor(el, options) {
		options.plugins = [TimeGrid];
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