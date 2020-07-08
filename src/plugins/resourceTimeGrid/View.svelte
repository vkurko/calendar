<script>
	import {getContext} from 'svelte';
	import Header from '../timeGrid/Header.svelte';
	import Body from '../timeGrid/Body.svelte';
	import Column from '../timeGrid/Column.svelte';

	let {resources, _viewDates, _intlDayHeader, theme} = getContext('options');
</script>

<Header>
	{#each $resources as resource}
		<div class="{$theme.resource}">
			<div class="{$theme.column}">{resource.title}</div>
			<div class="{$theme.flex}">
				{#each $_viewDates as date}
					<div class="{$theme.column}">{$_intlDayHeader.format(date)}</div>
				{/each}
			</div>
		</div>
	{/each}
</Header>
<Body>
	{#each $resources as resource}
		<div class="{$theme.resource}">
			{#each $_viewDates as date}
				<Column {date} resourceId="{resource.id}"/>
			{/each}
		</div>
	{/each}
</Body>