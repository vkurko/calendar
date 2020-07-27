<script>
	import {getContext, tick} from 'svelte';

	let {_events, _scrollable, theme} = getContext('state');

	let el;

	$: if (el && $_events) {
		tick().then(recheckScrollable);
	}

	function recheckScrollable() {
		$_scrollable = el.scrollHeight > el.clientHeight;
	}
</script>

<div bind:this="{el}" class="{$theme.body} {$theme.month}">
	<slot></slot>
</div>

<svelte:window on:resize={recheckScrollable}/>