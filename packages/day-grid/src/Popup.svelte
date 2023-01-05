<script>
    import {getContext, onMount} from 'svelte';
    import {ancestor, rect, outsideEvent} from '@event-calendar/common';
    import Event from './Event.svelte';

    let {theme, _ignoreClick, _intlDayPopover} = getContext('state');
    let {_popupDate, _popupChunks} = getContext('view-state');

    let el;
    let style = '';

    onMount(() => {
        let dayEl = ancestor(el, 1);
        let bodyEl = ancestor(dayEl, 3);
        let popupRect = rect(el);
        let bodyRect = rect(bodyEl);

        if (!dayEl.previousElementSibling) {
            style = 'left:0;';
        } else if (!dayEl.nextElementSibling) {
            style = 'right:0;';
        } else {
            let left = (dayEl.offsetWidth - popupRect.width) / 2;
            style = `left:${left}px;`;
        }

        let top = (dayEl.offsetHeight - popupRect.height) / 2;
        if (popupRect.top + top < bodyRect.top) {
            top = bodyRect.top - popupRect.top;
        } else if (popupRect.bottom + top > bodyRect.bottom) {
            top = bodyRect.bottom - popupRect.bottom;
        }
        style += `top:${top}px;`;

        if (popupRect.top + top + popupRect.height > bodyRect.bottom) {
            let bottom = popupRect.top + dayEl.offsetHeight - bodyRect.bottom;
            style += `bottom:${bottom}px;`;
        }
    });

    function close(e) {
        $_popupDate = null;
    }

    function handlePointerDownOutside(e) {
        close();
        $_ignoreClick = true;
    }
</script>

<div
    bind:this={el}
    class="{$theme.popup}"
    {style}
    use:outsideEvent={'pointerdown'}
    on:pointerdown|stopPropagation
    on:pointerdownoutside={handlePointerDownOutside}
>
    <div class="{$theme.dayHead}">{$_intlDayPopover.format($_popupDate)} <a on:click|stopPropagation={close}>&times;</a></div>
    <div class="{$theme.events}">
        {#each $_popupChunks as chunk (chunk.event)}
            <Event {chunk} inPopup />
        {/each}
    </div>
</div>