<script>
    import {getContext, afterUpdate} from 'svelte';
    import {max} from '@event-calendar/core';
    import Label from './Label.svelte';

    let {_viewResources, _headerEl, _resHs, _sidebarEl, theme} = getContext('state');

    let titleHeight = 0;

    afterUpdate(() => {
        titleHeight = $_headerEl.clientHeight;
    });
</script>

<div class="{$theme.sidebar}">
    <div class="{$theme.sidebarTitle}" style="flex-basis: {titleHeight}px"></div>
    <div class="{$theme.content}" bind:this={$_sidebarEl}>
        {#each $_viewResources as resource}
            <div class="{$theme.resource}" style="flex-basis: {max($_resHs.get(resource) ?? 0, 34)}px" role="rowheader">
                <Label {resource}/>
            </div>
        {/each}
    </div>
</div>
