<script>
    import {getContext} from 'svelte';
    import BaseEvent from './BaseEvent.svelte';
    import {bgEvent, helperEvent} from '#lib';

    let {
        el = $bindable(),
        chunk,
        styles,
        axis,
        forceDate,
        forceMargin
    } = $props();

    let {iClasses, interaction: {action, resizer: Resizer}} = $derived(getContext('state'));
    let {snap} = $derived(getContext('view-state'));  // timeGrid has snap, others don't

    let event = $derived(chunk.event);
    let display = $derived(chunk.event.display);

    // Class
    let classes = $derived(classNames => iClasses(classNames, event));

    function createDragHandler(event) {
        return action?.draggable(event)
            ? jsEvent => action.drag(event, jsEvent, forceDate, forceMargin, snap)
            : action?.noAction;
    }
    let onpointerdown = $derived(!bgEvent(display) && !helperEvent(display) ? createDragHandler(event) : undefined);
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
