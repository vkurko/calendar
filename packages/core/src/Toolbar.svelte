<script>
	import {getContext} from 'svelte';
	import Buttons from './Buttons.svelte';

	let {headerToolbar, theme} = getContext('state');

	let sections = {
		start: [],
		center: [],
		end: []
	};

	$: {
		for (let key of Object.keys(sections)) {
			sections[key] = $headerToolbar[key].split(' ').map(group => group.split(','));
		}
	}
</script>

<div class="{$theme.toolbar}">
	{#each Object.keys(sections) as key}
		<div>
			{#each sections[key] as buttons}
				{#if buttons.length > 1}
					<div class="{$theme.buttonGroup}">
						<Buttons {buttons}/>
					</div>
				{:else}
					<Buttons {buttons}/>
				{/if}
			{/each}
		</div>
	{/each}
</div>