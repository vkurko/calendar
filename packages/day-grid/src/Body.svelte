<script>
	import {getContext, tick} from 'svelte';
	import {hasYScroll} from '@event-calendar/common';

	let {_events, _scrollable, theme} = getContext('state');

	let el;

	$: if (el && $_events) {
		tick().then(recheckScrollable);
	}

	function recheckScrollable() {
		$_scrollable = hasYScroll(el);
	}
</script>

<div bind:this="{el}" class="{$theme.body} {$theme.month}">
	<div class="{$theme.content}">
		<slot></slot>
	</div>
</div>

<svelte:window on:resize={recheckScrollable}/>