<script>
    import {getContext, onMount} from 'svelte';
    import {ancestor, rect} from '@event-calendar/common';
    import {clickOutside} from './utils';
    import Event from './Event.svelte';

    let {theme, _intlDayPopover} = getContext('state');
    let {_popup} = getContext('view-state');

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
        $_popup.date = null;
    }

    function handleClickOutside(e) {
        close();
        e.detail.clickEvent.ecClosingPopup = true;
    }
</script>

<div bind:this={el} class="{$theme.popup}" {style} on:click|stopPropagation use:clickOutside on:clickoutside={handleClickOutside}>
    <div class="{$theme.dayHead}">{$_intlDayPopover.format($_popup.date)} <a on:click|stopPropagation={close}>&times;</a></div>
    <div class="{$theme.events}">
        {#each $_popup.chunks as chunk}
            <Event {chunk} inPopup />
        {/each}
    </div>
</div>