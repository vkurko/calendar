import Calendar from './Calendar.svelte';

window.Calendar = function (el, options) {
	const cal = new Calendar({
		target: el,
		props: {
			options
		}
	});

	this.setOption = function (name, value) {
		cal.setOption(name, value);
	};

	this.getOption = function (name) {
		return cal.getOption(name);
	};
};