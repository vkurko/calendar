<script>
	import {getContext} from 'svelte';
	import {createDate, cloneDate, subtractDay, addDuration, subtractDuration, setMidnight} from '@event-calendar/common';

	export let buttons;

	let {_currentRange, _viewTitle, buttonText, date, duration, hiddenDays, theme, view} = getContext('state');

	let today = setMidnight(createDate()), isToday;

	$: isToday = today >= $_currentRange.start && today < $_currentRange.end || null;

	function prev() {
		let d = subtractDuration($date, $duration);
		if ($hiddenDays.length && $hiddenDays.length < 7) {
			while ($hiddenDays.includes(d.getUTCDay())) {
				subtractDay(d);
			}
		}
		$date = d;
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
		<button class="{$theme.button} ec-{button}" on:click={() => $date = cloneDate(today)} disabled={isToday}>{$buttonText[button]}</button>
	{:else}
		<button class="{$theme.button}{$view === button ? ' ' + $theme.active : ''} ec-{button}" on:click={() => $view = button}>{$buttonText[button]}</button>
	{/if}
{/each}
