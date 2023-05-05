<script>
    import {getContext} from 'svelte';

    let {resources, _resBgColor, _resTxtColor} = getContext('state');

    $_resBgColor = event => {
        let resource = $resources.find(res => event.resourceIds.includes(res.id));
        return resource?.eventBackgroundColor;
    };

    $_resTxtColor = event => {
        let resource = $resources.find(res => event.resourceIds.includes(res.id));
        return resource?.eventTextColor;
    };
</script>
