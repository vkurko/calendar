<script>
    import {getContext} from 'svelte';

    let {dayMaxEvents, _bodyEl, theme} = getContext('state');
</script>

<div
    bind:this={$_bodyEl}
    class="{$theme.body}{$dayMaxEvents === true ? ' ' + $theme.uniform : ''}"
>
    <div class="{$theme.content}">
        <slot></slot>
    </div>
</div>
