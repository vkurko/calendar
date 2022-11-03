<script>
    import {getContext, onMount} from 'svelte';
    import {ancestor, rect, clickOutside} from '@event-calendar/common';
    import Event from './Event.svelte';

    let {theme, _intlDayPopover} = getContext('state');
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
    });

    function close(e) {
        $_popupDate = null;
    }

    function handleClickOutside(e) {
        close();
        e.detail.jsEvent.ecClosingPopup = true;
    }
</script>

<div
    bind:this={el}
    class="{$theme.popup}"
    {style}
    use:clickOutside
    on:click|stopPropagation
    on:pointerdown|stopPropagation
    on:clickoutside={handleClickOutside}
>
    <div class="{$theme.dayHead}">{$_intlDayPopover.format($_popupDate)} <a on:click|stopPropagation={close}>&times;</a></div>
    <div class="{$theme.events}">
        {#each $_popupChunks as chunk}
            <Event {chunk} inPopup />
        {/each}
    </div>
</div>