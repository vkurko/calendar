<script>
	import {getContext, onMount, onDestroy} from 'svelte';
	import {createDate, setMidnight} from '@event-calendar/common';

	let {slotDuration, slotHeight, theme} = getContext('state');

	let {_slotTimeLimits} = getContext('view-state');

	let now;
	let today;
	let top = 0;
	let intervalID;

	timer();

	$: {
		// Style
		let step = $slotDuration.seconds / 60;
		let offset = $_slotTimeLimits.min.seconds / 60;
		let start = (now - today) / 1000 / 60;
		top = (start - offset) / step * $slotHeight;
	}

	onMount(() => intervalID = setInterval(timer, 60000));
	onDestroy(() => clearInterval(intervalID));

	function timer() {
		now = createDate();
		today = setMidnight(createDate());
	}
</script>

<div
	class="{$theme.nowIndicator}"
	style="top:{top}px"
></div>