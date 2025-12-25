<script>
    import {getContext, onMount, untrack} from 'svelte';
    import {
        assign, contentFrom, createEventChunk, outsideEvent, keyEnter, rect, stopPropagation, toISOString
    } from '#lib';
    import Event from './Event.svelte';

    let viewState = getContext('view-state');
    let {interaction, options: {buttonText, theme}} = $derived(getContext('state'));
    let {colsCount, chunks, gridEl, intlDayPopover, popupDay} = $derived(viewState);

    let el = $state();
    let style = $state('');

    let {gridColumn, gridRow, dayStart, dayEnd} = $derived(popupDay);

    let popupChunks = $derived.by(() => {
        let result = [];
        for (let chunk of chunks) {
            if (chunk.gridRow === gridRow && chunk.gridColumn <= gridColumn && chunk.gridColumn + chunk.dates.length > gridColumn) {
                result.push(assign({}, chunk, createEventChunk(chunk.event, dayStart, dayEnd)));
            }
        }
        result.sort((a, b) => a.top - b.top);
        return result;
    });

    onMount(() => {
        el.show();
    });

    $effect(() => {
        if (popupChunks.length) {
            untrack(position);
        } else {
            close();
        }
    });

    function position() {
        let dayEl = gridEl.children.item((gridRow - 1) * colsCount + gridColumn - 1);
        let popupRect = rect(el);
        let dayRect = rect(dayEl);
        let gridRect = rect(gridEl);
        style = '';

        let left;
        if (popupRect.width >= gridRect.width) {
            left = gridRect.left - dayRect.left;
            let right = dayRect.right - gridRect.right;
            style += `inset-inline-end:${right}px;`;
        } else {
            left = (dayRect.width - popupRect.width) / 2;
            if (dayRect.left + left < gridRect.left) {
                left = gridRect.left - dayRect.left;
            } else if (dayRect.left + left + popupRect.width > gridRect.right) {
                left = gridRect.right - dayRect.left - popupRect.width;
            }
        }
        style += `inset-inline-start:${left}px;`;

        let top;
        if (popupRect.height >= gridRect.height) {
            top = gridRect.top - dayRect.top;
            let bottom = dayRect.bottom - gridRect.bottom;
            style += `inset-block-end:${bottom}px;`;
        } else {
            top = (dayRect.height - popupRect.height) / 2;
            if (dayRect.top + top < gridRect.top) {
                top = gridRect.top - dayRect.top;
            } else if (dayRect.top + top + popupRect.height > gridRect.bottom) {
                top = gridRect.bottom - dayRect.top - popupRect.height;
            }
        }
        style += `inset-block-start:${top}px;`;
    }

    function close() {
        viewState.popupDay = null;
    }

    function handlePointerDownOutside() {
        close();
        interaction.action?.noClick();
    }
</script>

<dialog
    bind:this={el}
    class="{theme.popup}"
    closedby="closerequest"
    {style}
    style:grid-area="{`${gridRow + 1} / ${gridColumn}`}"
    {@attach outsideEvent('pointerdown')}
    onpointerdownoutside={handlePointerDownOutside}
    onclose={close}
>
    <header class="{theme.dayHead}">
        <time datetime="{toISOString(dayStart, 10)}" {@attach contentFrom(intlDayPopover.format(dayStart))}></time>
        <!-- svelte-ignore a11y_missing_attribute -->
        <!-- svelte-ignore a11y_autofocus -->
        <a
            autofocus
            role="button"
            tabindex="0"
            aria-label={buttonText.close}
            onclick={stopPropagation(close)}
            onkeydown={keyEnter(close)}
        >&times;</a>
    </header>
    <div class="{theme.events}">
        {#each popupChunks as chunk}
            <Event {chunk} inPopup />
        {/each}
    </div>
</dialog>
