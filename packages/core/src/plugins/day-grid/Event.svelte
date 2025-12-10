<script>
    import {getContext} from 'svelte';
    import {bgEvent, height, isEmpty, max, repositionEvent} from '#lib';
    import {InteractableEvent} from '#components';

    let {chunk, gridEl, inPopup = false} = $props();

    let {_colsCount, _hiddenChunks, _popupDay, dayMaxEvents} = getContext('state');

    let el = $state();
    let margin = $state(0);
    let hidden = $state(false);

    let event = $derived(chunk.event);
    let display = $derived(chunk.event.display);
    let dayEl = $derived(gridEl?.children.item((chunk.gridRow - 1) * $_colsCount + chunk.gridColumn - 1));

    $effect(() => {
        if (dayEl) {
            margin = height(dayEl.firstElementChild);
        }
    });

    // Style
    let styles = $derived(style => {
        style['grid-column'] = `${chunk.gridColumn} / span ${chunk.dates.length}`;
        style['grid-row'] = chunk.gridRow;
        if (!bgEvent(display)) {
            let marginTop = inPopup ? 1 : margin;
            if (event._margin) {
                // Force margin for helper events
                let [_margin, _gridRow] = event._margin;
                if (_margin > marginTop && chunk.gridRow === _gridRow) {
                    marginTop = _margin;
                }
            }
            style['margin-block-start'] = `${marginTop}px`;
        }
        if (hidden) {
            style['visibility'] = 'hidden';
        }
        return style;
    });

    export function reposition() {
        margin = repositionEvent(chunk, height(el), height(dayEl.firstElementChild));
    }

    export function hide() {
        if ($dayMaxEvents === true) {
            let h = height(dayEl) - footHeight(dayEl);
            hidden = chunk.bottom > h;
            if (hidden) {
                // Hide the event throughout all days
                for (let date of chunk.dates) {
                    let key = date.getTime();
                    if ($_hiddenChunks[key]) {
                        if (!$_hiddenChunks[key].includes(chunk)) {
                            $_hiddenChunks[key] = [...$_hiddenChunks[key], chunk];
                        }
                    } else {
                        $_hiddenChunks[key] = [chunk];
                    }
                }
            }
        } else {
            hidden = false;
            if (!isEmpty($_hiddenChunks)) {
                $_hiddenChunks = {};
            }
        }
    }

    function footHeight(dayEl) {
        let h = 0;
        for (let i = 0; i < chunk.dates.length; ++ i) {
            h = max(h, height(dayEl.lastElementChild));
            dayEl = dayEl.nextElementSibling;
            if (!dayEl) {
                break;
            }
        }
        return h;
    }
</script>

<InteractableEvent
    bind:el
    {chunk}
    {styles}
    axis="x"
    forceDate={inPopup && $_popupDay.dayStart}
    forceMargin={[margin, chunk.gridRow]}
/>
