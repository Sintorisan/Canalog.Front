import type { CalendarEvent, EventApiResponse } from "../types/event";
import { fetchTodayEvents, fetchWeekEvents } from "./apiService";

export const getTodayEvents = async (): Promise<CalendarEvent[]> => {
    const apiResponse: EventApiResponse[] = await fetchTodayEvents();
    return mapToEvents(apiResponse);
};

export const getEventsForDate = async (date: Date): Promise<CalendarEvent[]> => {
    const isoDate = date.toISOString();
    const apiResponse: EventApiResponse[] = await fetchWeekEvents(isoDate);

    return mapToEvents(apiResponse);
};

const mapToEvents = (apiResponse: EventApiResponse[]): CalendarEvent[] => {
    return apiResponse.map((response) => ({
        id: response.id,
        title: response.title,
        start: new Date(response.start),
        end: new Date(response.end),
        eventColor: response.eventColor,
    }));
};
