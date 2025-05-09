<script>
    import {getContext} from 'svelte';
    import BaseEvent from './BaseEvent.svelte';
    import {bgEvent, helperEvent} from "#lib";

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
    let display = $derived(chunk.event.display);

    // Class
    let classes = $derived(classNames => $_iClasses(classNames, event));

    function createDragHandler(event) {
        return $_interaction.action?.draggable(event)
            ? jsEvent => $_interaction.action.drag(
                event, jsEvent, forceDate?.(), forceMargin?.()
            )
            : $_interaction.action?.noAction;
    }
    let onpointerdown = $derived(!bgEvent(display) && !helperEvent(display) ? createDragHandler(event) : undefined);

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
