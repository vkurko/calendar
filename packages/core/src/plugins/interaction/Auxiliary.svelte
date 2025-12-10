<script>
    import {getContext} from 'svelte';
    import {bgEvent, helperEvent, listen} from '#lib';
    import {eventDraggable} from './lib';
    import Action from './Action.svelte';
    import Pointer from './Pointer.svelte';
    import Resizer from './Resizer.svelte';

    let {theme, editable, eventStartEditable, pointer, _mainEl,
        _interaction, _iClasses} = getContext('state');

    $_interaction.resizer = Resizer;

    $effect(() => {
        $theme;
        $eventStartEditable;
        $editable;
        $_iClasses = (classNames, event) => {
            let {display} = event;
            return [
                ...classNames,
                helperEvent(display)
                    ? [$theme[display]]
                    : (
                        !bgEvent(display) && eventDraggable(event, $eventStartEditable, $editable)
                            ? [$theme.draggable]
                            : []
                    )
            ];
        };
    });

    $effect(() => {
        if ($_mainEl) {
            return listen($_mainEl, 'scroll', mainElScrollHandler);
        }
    });

    function mainElScrollHandler() {
        for (let component of Object.values($_interaction)) {
            component?.handleScroll?.();
        }
    }
</script>

<Action bind:this={$_interaction.action}/>
{#if $pointer}
    <Pointer bind:this={$_interaction.pointer}/>
{/if}
