export function createResources(input) {
    return input.map(resource => ({
        id: String(resource.id),
        title: resource.title || '',
        titleHTML: resource.titleHTML || '',
        eventBackgroundColor: resource.eventBackgroundColor,
        eventTextColor: resource.eventTextColor
    }));
}
