<script>
    import {getContext} from 'svelte';
    import {hasYScroll} from '@event-calendar/common';

    let {dayMaxEvents, _events, _scrollable, _scroll, theme} = getContext('state');

    let el;

    $: if (el && $_events) {
        setTimeout(recheckScrollable);
    }

    function recheckScrollable() {
        $_scrollable = hasYScroll(el);
    }
</script>

<div
    bind:this={el}
    class="{$theme.body}{$dayMaxEvents === true ? ' ' + $theme.uniform : ''}"
    on:scroll={$_scroll}
>
    <div class="{$theme.content}">
        <slot></slot>
    </div>
</div>

<svelte:window on:resize={recheckScrollable}/>