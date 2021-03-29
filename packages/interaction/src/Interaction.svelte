<script>
    import {getContext} from 'svelte';
    import Drag from './Drag.svelte';

    let {editable, eventStartEditable, _interaction} = getContext('state');
</script>

{#if $editable || $eventStartEditable}
    <Drag bind:this={$_interaction.drag}/>
{/if}