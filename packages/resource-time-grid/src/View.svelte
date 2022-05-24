<script>
	import {getContext, setContext} from 'svelte';
	import State from './state';
	import {Header, Body, Day, Week} from '@event-calendar/time-grid';

	let state = getContext('state');
	let {datesAboveResources, _viewDates, _intlDayHeader, _viewClass, allDaySlot, theme} = state;

	let viewState = new State(state);
	setContext('view-state', viewState);

	let {_viewResources} = viewState;

	$_viewClass = 'week';

	let loops, titles;
	$: {
		loops = [];
		titles = [];
		for (let i of $datesAboveResources ? [1, 0] : [0, 1]) {
			loops.push(i ? $_viewDates : $_viewResources);
			titles.push(i ? date => $_intlDayHeader.format(date) : resource => resource.title);
		}
	}
</script>

<Header>
	{#each loops[0] as item0}
		<div class="{$theme.resource}">
			<div class="{$theme.day}">{titles[0](item0)}</div>
			{#if loops[1].length > 1}
				<div class="{$theme.days}">
					{#each loops[1] as item1}
						<div class="{$theme.day}">{titles[1](item1)}</div>
					{/each}
				</div>
			{/if}
		</div>
	{/each}
</Header>
{#if $allDaySlot}
	<Header allDay>
		{#if $datesAboveResources}
			{#each $_viewDates as date}
				<div class="{$theme.resource}">
					{#each $_viewResources as resource}
						<Week dates={[date]} {resource}/>
					{/each}
				</div>
			{/each}
		{:else}
			{#each $_viewResources as resource}
				<div class="{$theme.resource}">
					<Week dates={$_viewDates} {resource}/>
				</div>
			{/each}
		{/if}
	</Header>
{/if}
<Body>
	{#each loops[0] as item0}
		<div class="{$theme.resource}">
			{#each loops[1] as item1}
				<Day
					date={$datesAboveResources ? item0 : item1}
					resource={$datesAboveResources ? item1 : item0}
				/>
			{/each}
		</div>
	{/each}
</Body>