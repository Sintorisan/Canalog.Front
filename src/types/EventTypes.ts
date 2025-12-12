import type { EventColor } from "./OptionsTypes";

//Client models
export type WeekEvents = {
    weekStart: Date;
    weekEnd: Date;
    days: DayEvents[];
};

export type DayEvents = {
    date: Date;
    events: CalendarEvent[];
};

export type CalendarEvent = {
    id: string;
    title: string;
    start: Date;
    end: Date;
    color: EventColor;
};

//api responses
export type WeekEventsApiResponse = {
    weekStart: string;
    weekEnd: string;
    days: DayEventApiResponse[];
};

export type DayEventApiResponse = {
    date: string;
    events: EventApiResponse[];
};

export type EventApiResponse = {
    id: string;
    title: string;
    start: string;
    end: string;
    color: EventColor;
};

export type EventRequest = {
    id?: string;
    title: string;
    start: Date;
    end: Date;
    color: number;
};
