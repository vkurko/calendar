<script>
	import {setContext} from 'svelte';
	import {get} from 'svelte/store';
	import Options from './options';
	import Toolbar from './Toolbar.svelte';
	import TimeGrid from './views/timeGrid/View.svelte';

	export let options;

	let opts = new Options(options);
	setContext('options', opts);

	let {view: viewName, views, theme} = opts;

	let view;

	$: {
		switch ($viewName) {
			case 'timeGridDay':
			case 'timeGridWeek':
			default:
				view = TimeGrid;
		}
	}

	export function setOption(name, value) {
		if (opts.hasOwnProperty(name)) {
			opts[name].set(value);
		}
	}

	export function getOption(name) {
		return opts.hasOwnProperty(name) ? get(opts[name]) : undefined;
	}
</script>

<div class="{$theme.calendar}">
	<Toolbar/>
	<svelte:component this={view}/>
</div>