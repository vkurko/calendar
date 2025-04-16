<script>
    import {getContext} from 'svelte';
    import BaseEvent from './BaseEvent.svelte';

    let {
        el = $bindable(),
        chunk,
        styles,
        axis,
        forceDate,
        forceMargin
    } = $props();

    let {_interaction, _iClasses} = getContext('state');

    let event = $derived(chunk.event);

    // Class
    let classes = $derived(classNames => $_iClasses(classNames, event));

    function createDragHandler(event) {
        return $_interaction.action?.draggable(event)
            ? jsEvent => $_interaction.action.drag(
                event, jsEvent, forceDate?.(), forceMargin?.()
            )
            : undefined;
    }
    let onpointerdown = $derived(createDragHandler(event));

    let Resizer = $derived($_interaction.resizer);
</script>

<BaseEvent bind:el {chunk} {classes} {styles} {onpointerdown}>
    {#snippet body(defaultBody)}
        {#if Resizer}
            <Resizer {chunk} {axis} {forceDate} {forceMargin}>
                {@render defaultBody()}
            </Resizer>
        {:else}
            {@render defaultBody()}
        {/if}
    {/snippet}
</BaseEvent>
