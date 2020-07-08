<script>
	import {getContext} from 'svelte';
	import {modifyDate} from './utils';

	let {date, view, duration, theme} = getContext('options');

	function prev() {
		let d = $date;
		modifyDate(d, $duration, -1);
		$date = d;
	}

	function next() {
		let d = $date;
		modifyDate(d, $duration);
		$date = d;
	}
</script>

<div class="{$theme.toolbar}">
	<button on:click={prev}>&lt;</button>
	<button on:click={next}>&gt;</button>

	<button on:click={() => $view = 'timeGridWeek'}>Week</button>
	<button on:click={() => $view = 'timeGridDay'}>Day</button>
	<button on:click={() => $view = 'resourceTimeGridWeek'}>Resources Week</button>
	<button on:click={() => $view = 'resourceTimeGridDay'}>Resources Day</button>
</div>