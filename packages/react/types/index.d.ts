/// <reference lib="es6" />
/// <reference lib="dom" />
import type { CSSProperties, ForwardRefExoticComponent, ReactNode, RefAttributes } from "react";
import type { Calendar } from "@event-calendar/core";

export * from "@event-calendar/core";

type ContentOption =
    | "allDayContent"
    | "dayCellContent"
    | "eventContent"
    | "moreLinkContent"
    | "noEventsContent"
    | "resourceLabelContent"
    | "weekNumberContent";

/**
 * A React node or a function that returns it. The function receives the same argument as the function form of
 * the option. If nothing is returned (`null` or `undefined`), the default content is shown.
 */
type ReactContent<T> =
    | ReactNode
    | (Extract<T, (...args: any[]) => any> extends (...args: infer A) => any ? (...args: A) => ReactNode : never);

/** An arbitrary widget placed in the toolbar instead of a button */
export interface CustomItem {
    content: ReactNode | (() => ReactNode);
}

export interface CustomButtons {
    [key: string]: Calendar.CustomButton | CustomItem;
}

/** The options of the calendar, where the content is defined with React */
export type EventCalendarOptions =
    & Omit<Calendar.Options, ContentOption | "customButtons">
    & { [K in ContentOption]?: ReactContent<Calendar.Options[K]> }
    & { customButtons?: CustomButtons | ((customButtons: Calendar.CustomButtons) => Calendar.CustomButtons) };

export type EventCalendarProps = EventCalendarOptions & {
    plugins: Calendar.Plugin[];
    /** The options as an object, the options passed as separate props take precedence */
    options?: EventCalendarOptions;
    /** `className`, `style`, `id`, `data-*` and `aria-*` are set on the element that contains the calendar */
    className?: string;
    style?: CSSProperties;
    id?: string;
    [key: `data-${string}`]: unknown;
    [key: `aria-${string}`]: unknown;
};

/** The calendar. Its methods are available through the `ref`. */
export const EventCalendar: ForwardRefExoticComponent<EventCalendarProps & RefAttributes<Calendar>>;
