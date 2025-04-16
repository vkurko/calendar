<script>
    import {getContext} from 'svelte';
    import {ancestor, bgEvent, height, max, rect, repositionEvent} from '#lib';
    import {InteractableEvent} from '#components';

    let {chunk, longChunks = {}, inPopup = false, dates = []} = $props();

    let {dayMaxEvents, _hiddenEvents, _popupDate} = getContext('state');

    let el = $state();
    let margin = $state(1);
    let hidden = $state(false);

    let event = $derived(chunk.event);
    let display = $derived(chunk.event.display);

    // Style
    let styles = $derived(style => {
        if (bgEvent(display)) {
            style['width'] = `calc(${chunk.days * 100}% + ${(chunk.days - 1)}px)`;
        } else {
            let marginTop = margin;
            if (event._margin) {
                // Force margin for helper events
                let [_margin, _dates] = event._margin;
                if (chunk.date >= _dates[0] && chunk.date <= _dates.at(-1)) {
                    marginTop = _margin;
                }
            }
            style['width'] = `calc(${chunk.days * 100}% + ${(chunk.days - 1) * 7}px)`;
            style['margin-top'] = `${marginTop}px`;
        }
        if (hidden) {
            style['visibility'] = 'hidden';
        }
        return style;
    });

    export function reposition() {
        margin = repositionEvent(chunk, longChunks, height(el));
        if ($dayMaxEvents === true) {
            hide();
        } else {
            hidden = false;
        }
    }

    function hide() {
        let dayEl = ancestor(el, 2);
        let h = height(dayEl) - height(dayEl.firstElementChild) - footHeight(dayEl);
        hidden = chunk.bottom > h;
        let update = false;
        // Hide or show the event throughout all days
        for (let date of chunk.dates) {
            let hiddenEvents = $_hiddenEvents[date.getTime()];
            if (hiddenEvents) {
                let size = hiddenEvents.size;
                if (hidden) {
                    hiddenEvents.add(chunk.event);
                } else {
                    hiddenEvents.delete(chunk.event);
                }
                if (size !== hiddenEvents.size) {
                    update = true;
                }
            }
        }
        if (update) {
            $_hiddenEvents = $_hiddenEvents;
        }
    }

    function footHeight(dayEl) {
        let h = 0;
        for (let i = 0; i < chunk.days; ++i) {
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
    forceDate={() => inPopup ? $_popupDate : undefined}
    forceMargin={() => [rect(el).top - rect(ancestor(el, 1)).top, dates]}
/>
