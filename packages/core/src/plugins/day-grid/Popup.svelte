<script>
    import {getContext, tick, untrack} from 'svelte';
    import {ancestor, rect, setContent, outsideEvent, keyEnter, toISOString, stopPropagation} from '#lib';
    import Event from './Event.svelte';

    let {buttonText, theme, _interaction, _intlDayPopover, _popupDate, _popupChunks} = getContext('state');

    let el = $state();
    let style = $state('');

    function position() {
        let dayEl = ancestor(el, 1);
        let bodyEl = ancestor(dayEl, 3);
        let popupRect = rect(el);
        let dayRect = rect(dayEl);
        let bodyRect = rect(bodyEl);
        style = '';

        let left;
        if (popupRect.width >= bodyRect.width) {
            left = bodyRect.left - dayRect.left;
            let right = dayRect.right - bodyRect.right;
            style += `right:${right}px;`;
        } else {
            left = (dayRect.width - popupRect.width) / 2;
            if (dayRect.left + left < bodyRect.left) {
                left = bodyRect.left - dayRect.left;
            } else if (dayRect.left + left + popupRect.width > bodyRect.right) {
                left = bodyRect.right - dayRect.left - popupRect.width;
            }
        }
        style += `left:${left}px;`;

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

    $effect(() => {
        // Fire reposition only on popup chunks change
        $_popupChunks;
        // Let chunks to update/mount then position the popup
        tick().then(reposition);
    });
    function reposition() {
        if ($_popupChunks.length) {
            position();
        } else {
            close();
        }
    }

    function close() {
        $_popupDate = null;
        $_popupChunks = [];
    }

    function handlePointerDownOutside() {
        close();
        $_interaction.action?.noClick();
    }
</script>

<div
    bind:this={el}
    class="{$theme.popup}"
    {style}
    use:outsideEvent={'pointerdown'}
    onpointerdown={stopPropagation()}
    onpointerdownoutside={handlePointerDownOutside}
>
    <div class="{$theme.dayHead}">
        <time datetime="{toISOString($_popupDate, 10)}" use:setContent={$_intlDayPopover.format($_popupDate)}></time>
        <!-- svelte-ignore a11y_missing_attribute -->
        <a
            role="button"
            tabindex="0"
            aria-label={$buttonText.close}
            onclick={stopPropagation(close)}
            onkeydown={keyEnter(close)}
        >&times;</a>
    </div>
    <div class="{$theme.events}">
        {#each $_popupChunks as chunk (chunk.event)}
            <Event {chunk} inPopup />
        {/each}
    </div>
</div>
