import App from './App.svelte';

const app = new App({
	target: document.body,
	props: {
		options: {
			events: [
				{start: '2020-07-01 10:00', end: '2020-07-01 16:00'},
				{start: '2020-07-01 11:00', end: '2020-07-01 14:00'},
				{start: '2020-07-01 13:00', end: '2020-07-01 15:00'},
				{start: '2020-07-01 15:00', end: '2020-07-02 16:00'}
			]
		}
	}
});

export default app;