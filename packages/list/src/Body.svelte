<script>
    import {getContext} from 'svelte';

    let {_bodyEl, theme} = getContext('state');
</script>

<div bind:this={$_bodyEl} class="{$theme.body}">
    <div class="{$theme.content}">
        <slot></slot>
    </div>
</div>
