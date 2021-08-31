<script>
    import {getContext} from 'svelte';
    import Drag from './Drag.svelte';

    let {_interaction} = getContext('state');
</script>

<Drag bind:this={$_interaction.drag}/>
