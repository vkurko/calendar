<script>
	import {getContext, tick} from 'svelte';

	let {slotDuration, _intlSlotLabel, _viewDates, scrollTime, theme} = getContext('state');
	let {times, scrollable} = getContext('view-state');

	let el;
	let compact;
	let lines = [];

	$: {
		compact = $slotDuration.seconds >= 3600;
		lines.length = $times.length;
	}

	$: if (el && $_viewDates) {
		el.scrollTo(0, $scrollTime.seconds / $slotDuration.seconds * 24 - 12);
	}

	$: if (el && $slotDuration) {
		tick().then(() => $scrollable = el.scrollHeight > el.clientHeight);
	}
</script>

<div bind:this="{el}" class="{$theme.body}{compact ? ' ' + $theme.compact : ''}">
	<div class="{$theme.flex}">
		<div class="{$theme.sidebar}">
			{#each $times as time}
				<div class="{$theme.time}">{time}</div>
			{/each}
		</div>
		<div class="{$theme.content}">
			<div class="{$theme.lines}">
				{#each lines as line}
					<div class="{$theme.line}"></div>
				{/each}
			</div>
			<slot></slot>
		</div>
	</div>
</div>