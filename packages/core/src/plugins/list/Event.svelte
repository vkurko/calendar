<script>
    import {getContext} from 'svelte';
    import {BaseEvent} from '#components';

    let {chunk} = $props();

    let {interaction, options: {theme}} = $derived(getContext('state'));

    // Style
    let styles = $derived(style => {
        delete style['background-color'];
        delete style['color'];
        return style;
    });
</script>

<BaseEvent {chunk} {styles} onpointerdown={interaction.action?.noAction}>
    {#snippet body(defaultBody, bgColor, txtColor)}
        <div class="{theme.eventTag}" style:background-color={bgColor}></div>
        {@render defaultBody()}
    {/snippet}
</BaseEvent>
