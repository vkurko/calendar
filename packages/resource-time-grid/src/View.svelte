<script>
	import {getContext, setContext} from 'svelte';
	import {State, Header, Body, Day} from '@event-calendar/time-grid';

	let {resources, hideResourcesWithNoEvents, _activeRange, _events, _viewDates, _intlDayHeader, theme} = getContext('state');

	let state = new State(getContext('state'));
	setContext('view-state', state);

	let filteredResources;

	$: {
		filteredResources = $resources;

		if ($hideResourcesWithNoEvents) {
			filteredResources = $resources.filter(resource => {
				for (let event of $_events) {
					if (event.display === 'auto' && event.resourceIds.includes(resource.id) && event.start < $_activeRange.end && event.end > $_activeRange.start) {
						return true;
					}
				}
				return false;
			});
		}

		if (!filteredResources.length) {
			filteredResources = resources.mutate([{}]);
		}
	}
</script>

<Header>
	{#each filteredResources as resource}
		<div class="{$theme.resource}">
			<div class="{$theme.day}">{resource.title}</div>
			{#if $_viewDates.length > 1}
				<div class="{$theme.days}">
					{#each $_viewDates as date}
						<div class="{$theme.day}">{$_intlDayHeader.format(date)}</div>
					{/each}
				</div>
			{/if}
		</div>
	{/each}
</Header>
<Body>
	{#each filteredResources as resource}
		<div class="{$theme.resource}">
			{#each $_viewDates as date}
				<Day {date} {resource}/>
			{/each}
		</div>
	{/each}
</Body>