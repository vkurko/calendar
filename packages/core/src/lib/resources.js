import {setPayload} from './payload.js';
import {empty} from './utils.js';

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
        eventBackgroundColor: eventBackgroundColor(input),
        eventTextColor: eventTextColor(input),
        extendedProps: input.extendedProps ?? {}
    };
}

export function eventBackgroundColor(resource) {
    return resource?.eventBackgroundColor;
}

export function eventTextColor(resource) {
    return resource?.eventTextColor;
}

export function findFirstResource(event, resources) {
    return empty(event.resourceIds) ? undefined : resources.find(resource => event.resourceIds.includes(resource.id));
}
