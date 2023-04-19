<script>
    import {getContext} from 'svelte';

    let {resources, _resBgColor} = getContext('state');

    $_resBgColor = event => {
        let resource = $resources.find(res => event.resourceIds.includes(res.id));
        return resource?.eventBackgroundColor;
    };
</script>
