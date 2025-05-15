<script>
    import {getContext} from 'svelte';
    import {BaseEvent} from '#components';

    let {chunk} = $props();

    let {theme, _interaction} = getContext('state');

    // Style
    let styles = $derived(style => {
        delete style['background-color'];
        delete style['color'];
        return style;
    });
</script>

<BaseEvent {chunk} {styles} onpointerdown={$_interaction.action?.noAction}>
    {#snippet body(defaultBody, bgColor, txtColor)}
        <div class="{$theme.eventTag}" style:background-color={bgColor}></div>
        {@render defaultBody()}
    {/snippet}
</BaseEvent>
