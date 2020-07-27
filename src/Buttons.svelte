<script>
	import {getContext} from 'svelte';
	import {cloneDate, subtractDay, addDuration, subtractDuration, setMidnight} from './lib/date';

	export let buttons;

	let {date, duration, monthMode, buttonText, _activeRange, view, _viewTitle, theme} = getContext('state');

	let today = setMidnight(new Date()), isToday;

	$: isToday = today >= $_activeRange.start && today < $_activeRange.end || null;

	function prev() {
		$date = subtractDuration($date, $duration);
	}

	function next() {
		$date = addDuration($date, $duration);
	}
</script>

{#each buttons as button}
	{#if button == ''}
	{:else if button == 'title'}
		<h2 class="{$theme.title}">{$_viewTitle}</h2>
	{:else if button == 'prev'}
		<button class="{$theme.button} ec-{button}" on:click={prev}><i class="{$theme.icon} ec-{button}"></i></button>
	{:else if button === 'next'}
		<button class="{$theme.button} ec-{button}" on:click={next}><i class="{$theme.icon} ec-{button}"></i></button>
	{:else if button === 'today'}
		<button class="{$theme.button} ec-{button}" on:click={() => $date = cloneDate(today)} disabled="{isToday}">{$buttonText[button]}</button>
	{:else}
		<button class="{$theme.button}{$view === button ? ' ' + $theme.active : ''} ec-{button}" on:click={() => $view = button}>{$buttonText[button]}</button>
	{/if}
{/each}
