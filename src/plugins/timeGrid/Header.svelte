<script>
	import {getContext} from 'svelte';

	let {theme} = getContext('state');
	let {_times, _scrollable} = getContext('view-state');
</script>

<div class="{$theme.header}{$_scrollable ? ' ' + $theme.withScroll : ''}">
	<div class="{$theme.sidebar}">
		<div class="{$theme.hiddenTimes}">
			{#each $_times as time}
				<div class="{$theme.time}">{time}</div>
			{/each}
		</div>
	</div>
	<div class="{$theme.content}">
		<div class="{$theme.lines}"></div>
		<slot></slot>
	</div>
</div>