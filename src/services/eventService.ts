import type { CalendarEvent, EventApiResponse } from "../types/event";
import { fetchTodayEvents } from "./apiService";

export const getTodayEvents = async (): Promise<CalendarEvent[]> => {
    const apiResponse: EventApiResponse[] = await fetchTodayEvents(); // <-- FIX
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
