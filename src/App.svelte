<script>
	import {setContext} from 'svelte';
	import Store from './store';
	import Header from './Header.svelte';
	import Body from './Body.svelte';

	export let options;

	let store = new Store(options);

	let {theme} = store;

	setContext('store', store);
</script>

<div class="{$theme.calendar}">
	<Header/>
	<Body/>
</div>