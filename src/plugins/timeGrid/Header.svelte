<script>
	import {getContext} from 'svelte';

	let {theme} = getContext('state');
	let {times, scrollable} = getContext('view-state');
</script>

<div class="{$theme.header}{$scrollable ? ' ' + $theme.withScroll : ''}">
	<div class="{$theme.sidebar}">
		<div class="{$theme.hiddenTimes}">
			{#each $times as time}
				<div class="{$theme.time}">{time}</div>
			{/each}
		</div>
	</div>
	<div class="{$theme.content}">
		<div class="{$theme.lines}"></div>
		<slot></slot>
	</div>
</div>