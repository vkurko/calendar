<script>
    import {getContext} from 'svelte';
    import {datesEqual, toSeconds, intersectionObserver, isRtl} from '#lib';

    let {grid} = $props();

    let {_mainEl, _now, _today, _sidebarWidth, slotDuration, slotWidth, theme} = getContext('state');

    // Layout
    let {gridColumn, start, end} = $derived.by(() => {
        for (let day of grid[0]) {
            if (datesEqual(day.dayStart, $_today)) {
                return day;
            }
        }
        return {};
    });
    let left = $derived.by(() => {
        if ($_now < start || $_now > end) {
            return null;
        }
        let step = toSeconds($slotDuration);
        return ($_now - start) / 1000 / step * $slotWidth;
    });

    // Observe intersections
    let observerOptions = $derived({
        root: $_mainEl,
        rootMargin: isRtl() ? `0px -${$_sidebarWidth + 1}px 0px 0px` : `0px 0px 0px -${$_sidebarWidth + 1}px`,
        threshold: 0.0,
    });
    function onIntersect(el, entry) {
        el.classList.toggle($theme.hidden, !entry.isIntersecting);
    }
</script>

{#if gridColumn && left !== null}
    <div {@attach intersectionObserver(onIntersect, observerOptions)}
         class="{$theme.nowIndicator}"
         style:grid-column="{gridColumn + 1}"
         style:grid-row="2 / span {grid.length}"
         style:inset-inline-start="{left}px"
    ></div>
{/if}
