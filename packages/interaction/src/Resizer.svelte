<script>
    import {getContext} from 'svelte';

    export let event;

    let {theme, _resizable} = getContext('state');
</script>

{#if event.display === 'auto' && $_resizable(event)}
    <div
        class="{$theme.resizer}"
        on:pointerdown
    ></div>
{/if}