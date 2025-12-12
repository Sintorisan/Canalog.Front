import type {
    EventApiResponse,
    CalendarEvent,
    DayEventApiResponse,
    DayEvents,
    WeekEventsApiResponse,
    WeekEvents,
} from "../types/EventTypes";

export const mapEvent = (e: EventApiResponse): CalendarEvent => ({
    id: e.id,
    title: e.title,
    start: new Date(e.start),
    end: new Date(e.end),
    color: e.color,
});

export const mapEventList = (list: EventApiResponse[]): CalendarEvent[] => list.map(mapEvent);

export const mapDay = (day: DayEventApiResponse): DayEvents => ({
    date: new Date(day.date),
    events: mapEventList(day.events),
});

export const mapWeek = (week: WeekEventsApiResponse): WeekEvents => ({
    weekStart: new Date(week.weekStart),
    weekEnd: new Date(week.weekEnd),
    days: week.days.map(mapDay),
});

export const mapRequest = (e: CalendarEvent) => {
    return {
        id: e.id,
        title: e.title,
        start: e.start,
        end: e.end,
        color: e.color,
    };
};
