<script>
	import {getContext} from 'svelte';

	let {theme, _intlDayHeader, _scrollable} = getContext('state');
	let {_days} = getContext('view-state');
</script>

<div class="{$theme.header} {$theme.month}{$_scrollable ? ' ' + $theme.withScroll : ''}">
	<div class="{$theme.days}">
		{#each $_days as day}
			<div class="{$theme.day}">{$_intlDayHeader.format(day)}</div>
		{/each}
	</div>
	<div class="{$theme.hiddenScroll}"></div>
</div>