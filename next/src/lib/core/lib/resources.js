import {setPayload} from './payload.js';

export function createResources(input) {
    let result = [];
    _createResources(input, 0, result);
    return result;
}

function _createResources(input, level, flat) {
    let result = [];
    for (let item of input) {
        let resource = createResource(item);
        result.push(resource);
        flat.push(resource);
        let payload = {
            level,
            children: [],
            expanded: true,
            hidden: false
        };
        setPayload(resource, payload);
        if (item.children) {
            payload.children = _createResources(item.children, level + 1, flat);
        }
    }
    return result;
}

export function createResource(input) {
    return {
        id: String(input.id),
        title: input.title || '',
        eventBackgroundColor: input.eventBackgroundColor,
        eventTextColor: input.eventTextColor,
        extendedProps: input.extendedProps ?? {}
    };
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
