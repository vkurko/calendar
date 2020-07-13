<script>
	import {getContext, setContext} from 'svelte';
	import State from '../timeGrid/state';
	import Header from '../timeGrid/Header.svelte';
	import Body from '../timeGrid/Body.svelte';
	import Column from '../timeGrid/Column.svelte';

	let {resources, _viewDates, _intlDayHeader, theme} = getContext('state');

	let state = new State(getContext('state'));
	setContext('view-state', state);
</script>

<Header>
	{#each $resources as resource}
		<div class="{$theme.resource}">
			<div class="{$theme.column}">{resource.title}</div>
			{#if $_viewDates.length > 1}
				<div class="{$theme.flex}">
					{#each $_viewDates as date}
						<div class="{$theme.column}">{$_intlDayHeader.format(date)}</div>
					{/each}
				</div>
			{/if}
		</div>
	{/each}
</Header>
<Body>
	{#each $resources as resource}
		<div class="{$theme.resource}">
			{#each $_viewDates as date}
				<Column {date} {resource}/>
			{/each}
		</div>
	{/each}
</Body>