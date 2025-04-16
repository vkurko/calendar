<script>
    import {getContext} from 'svelte';
    import Sidebar from './Sidebar.svelte';
    import Header from './Header.svelte';
    import Body from './Body.svelte';

    let {theme} = getContext('state');
</script>

<div class="{$theme.container}">
    <Sidebar/>
    <div class="{$theme.main}">
        <Header/>
        <Body/>
    </div>
</div>
