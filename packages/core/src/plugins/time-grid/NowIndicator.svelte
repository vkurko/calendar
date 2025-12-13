<script>
    import {getContext} from 'svelte';
    import {datesEqual, toSeconds, intersectionObserver, isRtl} from '#lib';

    let {days, span = 1} = $props();

    let {_mainEl, _now, _today, _sidebarWidth, slotDuration, slotHeight, theme} = getContext('state');

    // Layout
    let {gridColumn, start, end} = $derived.by(() => {
        for (let day of days) {
            if (datesEqual(day.dayStart, $_today)) {
                return day;
            }
        }
        return {};
    });
    let top = $derived.by(() => {
        if ($_now < start || $_now > end) {
            return null;
        }
        let step = toSeconds($slotDuration);
        return ($_now - start) / 1000 / step * $slotHeight;
    });

    // Observe intersections
    let observerOptions = $derived({
        root: $_mainEl,
        rootMargin: isRtl() ? `0px -${$_sidebarWidth + 5.5}px 0px 0px` : `0px 0px 0px -${$_sidebarWidth + 5.5}px`,
        threshold: 0.0,
    });
    function onIntersect(el, entry) {
        el.classList.toggle($theme.hidden, !entry.isIntersecting);
    }
</script>

{#if gridColumn && top !== null}
    <div {@attach intersectionObserver(onIntersect, observerOptions)}
        class="{$theme.nowIndicator}"
        style:grid-column="{gridColumn + 1} / span {span}"
        style:inset-block-start="{top}px"
    ></div>
{/if}
