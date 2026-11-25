/**
 * The examples of the content options: one source for the code shown on the page of an option and for its demo,
 * so that they cannot differ. `args` are the properties of the argument, `body` is the markup, where {{x}} is a value.
 */
export const CONTENT_EXAMPLES = {
    allDayContent: {args: ['text'], body: '<i>{{text}}</i> ☀'},
    dayCellContent: {args: ['date'], body: '<b>{{date.getDate()}}</b> <small>{{date.toLocaleDateString(\'en\', {weekday: \'short\'})}}</small>'},
    // The classes of the default content, which clip what does not fit into the event
    eventContent: {args: ['event', 'timeText'], body: '<div class="ec-event-time">{{timeText}}</div>\n<div class="ec-event-title">★ {{event.title}}</div>'},
    moreLinkContent: {args: ['num'], body: '<b>{{num}}</b> hidden'},
    noEventsContent: {args: [], body: '<i>Nothing is planned</i>'},
    resourceLabelContent: {args: ['resource'], body: '<b>{{resource.title}}</b><br><small>id {{resource.id}}</small>'},
    weekNumberContent: {args: ['week'], body: 'Week {{week}}'},
};

/** The function for the calendar that renders the example of the option as HTML */
export function contentFunction(name) {
    let {args, body} = CONTENT_EXAMPLES[name];
    let render = new Function(...args, 'return `' + body.replace(/\n/g, '').replace(/\{\{(.+?)\}\}/g, '${$1}') + '`');
    return (arg = {}) => ({html: render(...args.map(key => arg[key]))});
}
