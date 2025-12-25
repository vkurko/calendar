<script>
    import {getContext} from 'svelte';
    import {keys} from '#lib';
    import Buttons from './Buttons.svelte';

    let {options: {headerToolbar, theme}} = $derived(getContext('state'));

    let sections = $derived.by(() => {
        let sections = {};
        for (let key of ['start', 'center', 'end']) {
            sections[key] = headerToolbar[key]?.split(' ').map(group => group.split(',')) ?? [];
        }
        return sections;
    });
</script>

<nav class="{theme.toolbar}">
    {#each keys(sections) as key}
        <div class="ec-{key}">
            {#each sections[key] as buttons}
                {#if buttons.length > 1}
                    <div class="{theme.buttonGroup}">
                        <Buttons {buttons}/>
                    </div>
                {:else}
                    <Buttons {buttons}/>
                {/if}
            {/each}
        </div>
    {/each}
</nav>
