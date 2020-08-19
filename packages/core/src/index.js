import Calendar from './Calendar.svelte';

export default class {
	#cal;

	constructor(el, options) {
		this.#cal = new Calendar({
			target: el,
			props: {
				options
			}
		});
	}

	setOption(name, value) {
		this.#cal.setOption(name, value);
		return this;
	}

	getOption(name) {
		return this.#cal.getOption(name);
	}

	refetchEvents() {
		this.#cal.refetchEvents();
		return this;
	}

	addEvent(event) {
		this.#cal.addEvent(event);
		return this;
	}

	updateEvent(event, create) {
		this.#cal.updateEvent(event, create);
		return this;
	}

	removeEvent(eventId) {
		this.#cal.removeEvent(eventId);
		return this;
	}

	get view() {
		return this.#cal.getView();
	}
}