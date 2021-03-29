<script>
	import {getContext, setContext} from 'svelte';
	import State from './state';
	import {Header, Body, Day} from '@event-calendar/time-grid';

	let state = getContext('state');
	let {_viewDates, _intlDayHeader, theme} = state;

	let viewState = new State(state);
	setContext('view-state', viewState);

	let {_viewResources} = viewState;
</script>

<Header>
	{#each $_viewResources as resource}
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
	{#each $_viewResources as resource}
		<div class="{$theme.resource}">
			{#each $_viewDates as date}
				<Day {date} {resource}/>
			{/each}
		</div>
	{/each}
</Body>