<script>
	import {setContext} from 'svelte';
	import {get} from 'svelte/store';
	import Options from './options/options';
	import Toolbar from './Toolbar.svelte';

	export let options;

	let opts = new Options(options);
	setContext('options', opts);

	let {_viewComponent, theme} = opts;

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
	<svelte:component this={$_viewComponent}/>
</div>