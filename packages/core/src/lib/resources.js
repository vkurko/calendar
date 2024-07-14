export function createResources(input) {
    return input.map(resource => ({
        id: String(resource.id),
        title: resource.title || '',
        titleHTML: resource.titleHTML || '',
        eventBackgroundColor: resource.eventBackgroundColor,
        eventTextColor: resource.eventTextColor
    }));
}

export function resourceBackgroundColor(event, resources) {
    return findResource(event, resources)?.eventBackgroundColor;
}

export function resourceTextColor(event, resources) {
    return findResource(event, resources)?.eventTextColor;
}

function findResource(event, resources) {
    return resources.find(resource => event.resourceIds.includes(resource.id));
}
