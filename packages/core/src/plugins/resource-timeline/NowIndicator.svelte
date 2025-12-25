<script>
    import {getContext} from 'svelte';
    import {datesEqual, toSeconds, intersectionObserver, isRtl} from '#lib';

    let {mainEl, now, today, options: {slotDuration, slotWidth, theme}} = $derived(getContext('state'));
    let {grid, sidebarWidth} = $derived(getContext('view-state'));

    // Layout
    let {gridColumn, start, end} = $derived.by(() => {
        for (let day of grid[0]) {
            if (datesEqual(day.dayStart, today)) {
                return day;
            }
        }
        return {};
    });
    let left = $derived.by(() => {
        if (now < start || now > end) {
            return null;
        }
        let step = toSeconds(slotDuration);
        return (now - start) / 1000 / step * slotWidth;
    });

    // Observe intersections
    let observerOptions = $derived({
        root: mainEl,
        rootMargin: isRtl() ? `0px -${sidebarWidth + 1}px 0px 0px` : `0px 0px 0px -${sidebarWidth + 1}px`,
        threshold: 0.0,
    });
    function onIntersect(el, entry) {
        el.classList.toggle(theme.hidden, !entry.isIntersecting);
    }
</script>

{#if gridColumn && left !== null}
    <div {@attach intersectionObserver(onIntersect, observerOptions)}
         class="{theme.nowIndicator}"
         style:grid-column="{gridColumn + 1}"
         style:grid-row="2 / span {grid.length}"
         style:inset-inline-start="{left}px"
    ></div>
{/if}
