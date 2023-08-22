<script>
    import {getContext, tick} from 'svelte';
    import {ancestor, rect, setContent, outsideEvent, keyEnter} from '@event-calendar/core';
    import Event from './Event.svelte';

    let {buttonText, theme, _interaction, _intlDayPopover, _popupDate, _popupChunks} = getContext('state');

    let el;
    let style = '';

    function position() {
        let dayEl = ancestor(el, 1);
        let bodyEl = ancestor(dayEl, 3);
        let popupRect = rect(el);
        let dayRect = rect(dayEl);
        let bodyRect = rect(bodyEl);

        if (!dayEl.previousElementSibling) {
            style = 'left:0;';
        } else if (!dayEl.nextElementSibling) {
            style = 'right:0;';
        } else {
            let left = (dayEl.offsetWidth - popupRect.width) / 2;
            style = `left:${left}px;`;
        }

        let top;
        if (popupRect.height >= bodyRect.height) {
            top = bodyRect.top - dayRect.top;
            let bottom = dayRect.bottom - bodyRect.bottom;
            style += `bottom:${bottom}px;`;
        } else {
            top = (dayRect.height - popupRect.height) / 2;
            if (dayRect.top + top < bodyRect.top) {
                top = bodyRect.top - dayRect.top;
            } else if (dayRect.top + top + popupRect.height > bodyRect.bottom) {
                top = bodyRect.bottom - dayRect.top - popupRect.height;
            }
        }
        style += `top:${top}px;`;
    }

    function reposition() {
        // Skip the first call (el is not defined at this time)
        if (el) {
            style = '';
            // Let chunks to update/mount then position the popup
            tick().then(() => {
                if ($_popupChunks.length) {
                    position();
                } else {
                    close();
                }
            });
        }
    }

    $: if ($_popupChunks) {
        // Fire reposition only on popup chunks change
       reposition();
    }

    function close(e) {
        $_popupDate = null;
    }

    function handlePointerDownOutside(e) {
        close();
        $_interaction.action?.noClick();
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
    <div class="{$theme.dayHead}">
        <span use:setContent={$_intlDayPopover.format($_popupDate)}></span>
        <!-- svelte-ignore a11y-missing-attribute -->
        <a
            role="button"
            tabindex="0"
            aria-label={$buttonText.close}
            on:click|stopPropagation={close}
            on:keydown={keyEnter(close)}
        >&times;</a>
    </div>
    <div class="{$theme.events}">
        {#each $_popupChunks as chunk (chunk.event)}
            <Event {chunk} inPopup />
        {/each}
    </div>
</div>