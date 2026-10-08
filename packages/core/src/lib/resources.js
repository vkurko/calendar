import {setPayload} from './payload.js';
import {empty} from './utils.js';

export function createResources(input) {
    let result = [];
    _createResources(input, 0, undefined, result);
    return result;
}

function _createResources(input, level, parent, flat) {
    let result = [];
    for (let item of input) {
        let resource = createResource(item);
        result.push(resource);
        flat.push(resource);
        let payload = {
            level,
            parent,
            children: []
        };
        setPayload(resource, payload);
        if (item.children) {
            payload.children = _createResources(item.children, level + 1, resource, flat);
        }
    }
    return result;
}

export function createResource(input) {
    return {
        id: input.id != null ? String(input.id) : '',
        title: input.title ?? '',
        eventBackgroundColor: eventBackgroundColor(input),
        eventTextColor: eventTextColor(input),
        expanded: input.expanded,
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
