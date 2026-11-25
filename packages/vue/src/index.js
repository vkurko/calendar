import {
    camelize, defineComponent, h, isReactive, onBeforeUnmount, onBeforeUpdate, onMounted, shallowRef, Teleport, toRaw,
    watch
} from 'vue';
import {createCalendar, destroyCalendar} from '@event-calendar/core';

export * from '@event-calendar/core';

// Options whose content is rendered by the slots with the same names
const CONTENT = (
    'allDayContent dayCellContent eventContent moreLinkContent noEventsContent resourceLabelContent weekNumberContent'
).split(' ');

let uid = 0;

export const EventCalendar = defineComponent({
    name: 'EventCalendar',
    inheritAttrs: false,
    setup(_, {attrs, slots, expose}) {
        let target = shallowRef();
        let calendar;
        let api = {};
        // The current values of the options, their watchers and the functions given to the calendar
        let options = {};
        let watchers = {};
        let stable = {};
        // The elements of the calendar the slots are rendered into
        let outlets = new Map();
        let version = shallowRef(0);

        expose(api);

        onMounted(() => {
            options = collect();
            calendar = createCalendar(target.value, toRaw(attrs.plugins), raw(options));
            for (let name in options) {
                observe(name);
            }
            // The methods of the calendar are available through the template ref
            Object.assign(api, calendar);
        });

        onBeforeUpdate(() => {
            // Set the options that did change
            let prev = options;
            options = collect();
            for (let name in {...prev, ...options}) {
                if (prev[name] !== options[name]) {
                    calendar.setOption(name, toRaw(options[name]));
                    observe(name);
                }
            }
        });

        onBeforeUnmount(() => {
            destroyCalendar(calendar);
            calendar = null;
        });

        /** Create the options of the calendar from the attributes and the slots of the component */
        function collect() {
            let result = {};
            for (let key in attrs) {
                if (!/^(class|style|id|plugins|(data|aria)-.*)$/.test(key)) {
                    let name = camelize(key);
                    let value = attrs[key];
                    if (name == 'options') {
                        result = {...value, ...result};
                    } else if (/^on[A-Z]/.test(name)) {
                        // An event listener is the callback of the calendar with the same name
                        name = name[2].toLowerCase() + name.slice(3);
                        result[name] = stable[name] ??= (...args) => {
                            let listeners = [attrs['on' + name[0].toUpperCase() + name.slice(1)]].flat();
                            return listeners.map(listener => listener?.(...args)).pop();
                        };
                    } else {
                        // An attribute without a value is a flag
                        result[name] = value === '' ? true : value;
                    }
                }
            }
            for (let key in slots) {
                let name = camelize(key);
                if (CONTENT.includes(name)) {
                    result[name] = stable[key] ??= content(key);
                } else if (name.startsWith('customButton')) {
                    // The slot of a toolbar item, named as the content snippets of the calendar are
                    name = name[12].toLowerCase() + name.slice(13);
                    let buttons = result.customButtons;
                    let item = stable[key] ??= {};
                    if (!item.to || item.from !== buttons) {
                        item.from = buttons;
                        item.to = {...buttons, [name]: {...buttons?.[name], content: content(key)}};
                    }
                    result.customButtons = item.to;
                }
            }
            return result;
        }

        /** Set the option again when its reactive value is changed in place */
        function observe(name) {
            watchers[name]?.();
            let value = options[name];
            watchers[name] = isReactive(value)
                ? watch(value, () => calendar?.setOption(name, toRaw(value)))
                : undefined;
        }

        /** Create the content function for the calendar, which returns the function that receives the element */
        function content(key) {
            return arg => el => {
                let outlet = outlets.get(el);
                if (!outlet) {
                    // The element can still hold the content rendered by the calendar
                    el.textContent = '';
                    outlets.set(el, outlet = {key: ++uid});
                }
                outlet.slot = key;
                outlet.arg = arg;
                outlet.live = true;
                ++version.value;

                return () => {
                    outlet.live = false;
                    if (calendar) {
                        ++version.value;
                    }
                };
            };
        }

        return () => {
            let {class: className, style, id} = attrs;
            let props = {ref: target, class: className, style, id};
            for (let key in attrs) {
                if (/^(data|aria)-/.test(key)) {
                    props[key] = attrs[key];
                }
            }
            // Render again when the properties of a reactive object with the options or the outlets are changed
            ({...attrs.options});
            version.value;
            // Render the slots into the elements of the calendar
            let children = [];
            for (let [el, outlet] of outlets) {
                if (outlet.live) {
                    children.push(h(Outlet, {key: outlet.key, el, arg: outlet.arg, render: slots[outlet.slot]}));
                } else {
                    outlets.delete(el);
                }
            }
            return h('div', props, children);
        };
    }
});

// A component, so that the slot is rendered again only when its argument or the state it uses did change
function Outlet({el, arg, render}) {
    return h(Teleport, {to: el}, render?.(arg));
}
Outlet.props = ['el', 'arg', 'render'];

function raw(options) {
    let result = {};
    for (let name in options) {
        if (options[name] !== undefined) {
            result[name] = toRaw(options[name]);
        }
    }
    return result;
}
