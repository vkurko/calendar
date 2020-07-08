<script>
	import {getContext} from 'svelte';

	let {theme} = getContext('options');
</script>

<div class="{$theme.header}">
	<div class="{$theme.sidebar}"></div>
	<div class="{$theme.content}">
		<slot></slot>
	</div>
</div>