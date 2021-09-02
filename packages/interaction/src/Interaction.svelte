<script>
    import {getContext} from 'svelte';
    import Drag from './Drag.svelte';
    import Pointer from './Pointer.svelte';

    let {theme, editable, eventStartEditable, pointer, _interaction, _classes, _draggable, _scroll} = getContext('state');

    $: $_classes = (className, event) => {
        switch (event.display) {
            case 'auto': return className + ($_draggable(event) ? ' ' + $theme.draggable : '');
            case 'ghost': return `${$theme.event} ${$theme.ghost}`;
            case 'preview': return `${$theme.event} ${$theme.preview}`;
            case 'pointer': return `${$theme.event} ${$theme.pointer}`;
            default: return className;
        }
    };

    $: $_draggable = event => (event.startEditable ?? $eventStartEditable) || (event.editable ?? $editable);

    $_scroll = () => {
        for (let component of Object.values($_interaction)) {
            component && component.handleScroll && component.handleScroll();
        }
    };
</script>

<Drag bind:this={$_interaction.drag}/>
{#if $pointer}
    <Pointer bind:this={$_interaction.pointer}/>
{/if}
