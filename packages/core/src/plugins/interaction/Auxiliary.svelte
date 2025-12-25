<script>
    import {getContext} from 'svelte';
    import AuxState from './state.svelte.js';
    import Action from './Action.svelte';
    import Pointer from './Pointer.svelte';
    import Resizer from './Resizer.svelte';

    let mainState = getContext('state');
    new AuxState(mainState);

    let {interaction, options: {pointer}} = $derived(mainState);

    // svelte-ignore state_referenced_locally
    interaction.resizer = Resizer;
</script>

<Action bind:this={interaction.action}/>
{#if pointer}
    <Pointer bind:this={interaction.pointer}/>
{/if}
