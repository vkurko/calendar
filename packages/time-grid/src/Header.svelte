<script>
	import {getContext} from 'svelte';

	let {_scrollable, theme} = getContext('state');
	let {_times} = getContext('view-state');
</script>

<div class="{$theme.header}{$_scrollable ? ' ' + $theme.withScroll : ''}">
	<div class="{$theme.sidebar}">
		<div class="{$theme.hiddenTimes}">
			{#each $_times as time}
				<div class="{$theme.time}">{time}</div>
			{/each}
		</div>
	</div>
	<div class="{$theme.days}">
		<div class="{$theme.lines}"></div>
		<slot></slot>
	</div>
	<div class="{$theme.hiddenScroll}"></div>
</div>