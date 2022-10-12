<script>
    import {getContext} from 'svelte';

    let {theme} = getContext('state');
</script>

<div class="{$theme.body}">
    <div class="{$theme.content}">
        <slot></slot>
    </div>
</div>
