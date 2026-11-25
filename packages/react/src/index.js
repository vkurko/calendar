import {
    createElement, forwardRef, memo, useEffect, useImperativeHandle, useLayoutEffect, useReducer, useRef
} from 'react';
import {createPortal, flushSync} from 'react-dom';
import {createCalendar, destroyCalendar} from '@event-calendar/core';

export * from '@event-calendar/core';

// Options whose content is rendered by React
const CONTENT = (
    'allDayContent dayCellContent eventContent moreLinkContent noEventsContent resourceLabelContent weekNumberContent'
).split(' ');

// Callbacks that the calendar only calls, so they can be replaced without the calendar knowing it
const CALLBACKS = (
    'dateClick datesSet dragConstraint eventAllUpdated eventClick eventDidMount eventDragStart eventDragStop ' +
    'eventDrop eventMouseEnter eventMouseLeave eventResize eventResizeStart eventResizeStop loading noEventsClick ' +
    'resizeConstraint resourceExpand resourceLabelDidMount select selectConstraint unselect viewDidMount'
).split(' ');

const useIsomorphicLayoutEffect = typeof document == 'undefined' ? useEffect : useLayoutEffect;

let uid = 0;

export const EventCalendar = forwardRef(function EventCalendar({plugins, options, className, style, id, ...rest}, ref) {
    let props = {...options};
    let attrs = {ref: useRef(null), className, style, id};
    for (let name in rest) {
        // Data and ARIA attributes are passed to the element, everything else is the options of the calendar
        (name.includes('-') ? attrs : props)[name] = rest[name];
    }

    let update = useReducer(n => n + 1, 0)[1];
    let self = useRef(null);
    let s = self.current ??= {slots: new Map(), stable: {}, update};

    useIsomorphicLayoutEffect(() => {
        s.props = props;
        if (s.calendar) {
            // Set the options that did change
            let prev = s.options;
            let next = s.options = toOptions(s);
            for (let name in {...prev, ...next}) {
                if (!same(prev[name], next[name])) {
                    s.calendar.setOption(name, next[name]);
                }
            }
        }
    });

    useIsomorphicLayoutEffect(() => {
        let calendar = s.calendar = createCalendar(attrs.ref.current, plugins, s.options = toOptions(s));

        return () => {
            s.calendar = null;
            destroyCalendar(calendar);
        };
    }, []);

    useImperativeHandle(ref, () => s.calendar, []);

    let portals = [];
    for (let [el, slot] of s.slots) {
        portals.push(createElement(Slot, {key: slot.key, el, arg: slot.arg, render: slot.read(props)}));
    }

    return createElement('div', attrs, portals);
});

const Slot = memo(function Slot({el, arg, render}) {
    return createPortal(isFunction(render) ? render(arg) : render, el);
});

/**
 * Create the options for the calendar. The functions given to the calendar stay the same between the renders,
 * so that a new function passed as a prop does not make the calendar update.
 */
function toOptions(s) {
    let options = {};
    for (let name in s.props) {
        let value = s.props[name];
        if (value !== undefined) {
            if (CONTENT.includes(name)) {
                value = stableContent(s, name, value, props => props[name]);
            } else if (isFunction(value)) {
                if (CALLBACKS.includes(name)) {
                    value = s.stable[name] ??= (...args) => s.props[name]?.(...args);
                }
            } else if (name == 'customButtons') {
                value = customButtons(s, value);
            }
            options[name] = value;
        }
    }
    return options;
}

function customButtons(s, buttons) {
    let result = {};
    for (let name in buttons) {
        let button = result[name] = {...buttons[name]};
        if (button.content != null) {
            button.content = stableContent(
                s, 'content:' + name, button.content, props => props.customButtons?.[name]?.content
            );
        }
        if (isFunction(button.click)) {
            button.click = s.stable['click:' + name] ??= (...args) => s.props.customButtons?.[name]?.click?.(...args);
        }
    }
    return result;
}

/**
 * Get the content function for the calendar. It stays the same when a new value is passed as a prop, because React
 * renders the content with the new value by itself. The exception is the value that did return nothing for some
 * content: the calendar shows its default content then, so it has to ask again to learn where the new value does it.
 */
function stableContent(s, key, value, read) {
    let fn = s.stable[key];
    if (!fn || fn.sparse && fn.value !== value) {
        fn = s.stable[key] = content(s, read);
    }
    fn.value = value;
    return fn;
}

/**
 * Create the content function for the calendar, which returns the function that receives the element to render into.
 * `read` returns what has to be rendered from the given props: a React node or a function that returns it.
 */
function content(s, read) {
    return function fn(arg) {
        let render = read(s.props);
        if ((isFunction(render) ? render(arg) : render) == null) {
            fn.sparse = true;
        } else {
            return el => {
                let slot = s.slots.get(el);
                if (!slot) {
                    // The element can still hold the content rendered by the calendar
                    el.textContent = '';
                    s.slots.set(el, slot = {key: ++uid});
                }
                slot.read = read;
                slot.arg = arg;
                slot.live = true;
                schedule(s);

                return () => {
                    slot.live = false;
                    schedule(s);
                };
            };
        }
    };
}

function schedule(s) {
    if (!s.scheduled) {
        s.scheduled = true;
        queueMicrotask(() => {
            s.scheduled = false;
            let reused = [];
            for (let [el, slot] of s.slots) {
                if (!slot.live) {
                    s.slots.delete(el);
                    if (el.isConnected) {
                        // The calendar has already replaced the content of the element, so React will not find its nodes
                        el.removeChild = removeChild;
                        reused.push(el);
                    }
                }
            }
            if (s.calendar) {
                // Render right away, so that the content is in place before the browser paints the calendar
                flushSync(s.update);
            }
            for (let el of reused) {
                delete el.removeChild;
            }
        });
    }
}

function removeChild(child) {
    return child.parentNode == this ? Node.prototype.removeChild.call(this, child) : child;
}

/** Compare the values of an option, so that an equal object or array created on each render is not set again */
function same(a, b, depth = 0) {
    if (a === b) {
        return true;
    }
    if (!a || !b || typeof a != 'object' || typeof b != 'object' || depth > 9) {
        return false;
    }
    if (a instanceof Date) {
        return b instanceof Date && +a == +b;
    }
    let proto = Object.getPrototypeOf(a);
    if (proto != Object.getPrototypeOf(b) || proto != Object.prototype && proto != Array.prototype) {
        return false;
    }
    let keys = Object.keys(a);
    return keys.length == Object.keys(b).length && keys.every(key => same(a[key], b[key], depth + 1));
}

function isFunction(value) {
    return typeof value == 'function';
}
