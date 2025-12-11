import type { CalendarEvent, EventApiResponse, EventRequest } from "../types/Event";
import { createEventApi, fetchTodayEvents, fetchWeekEvents } from "./apiService";

const mapToEvents = (apiResponse: EventApiResponse[]): CalendarEvent[] => {
    return apiResponse.map((response) => ({
        id: response.id,
        title: response.title,
        start: new Date(response.start),
        end: new Date(response.end),
        eventColor: response.eventColor,
    }));
};

const mapToEvent = (apiResponse: EventApiResponse): CalendarEvent => {
    return {
        id: apiResponse.id,
        title: apiResponse.title,
        start: new Date(apiResponse.start),
        end: new Date(apiResponse.end),
        eventColor: apiResponse.eventColor,
    };
};

export const getTodayEvents = async (token: string): Promise<CalendarEvent[]> => {
    const apiResponse: EventApiResponse[] = await fetchTodayEvents(token);
    return mapToEvents(apiResponse);
};

export const getEventsForDate = async (date: Date, token: string): Promise<CalendarEvent[]> => {
    const isoDate = date.toISOString();
    const apiResponse: EventApiResponse[] = await fetchWeekEvents(isoDate, token);

    return mapToEvents(apiResponse);
};

export const createEvent = async (request: EventRequest, token: string): Promise<CalendarEvent> => {
    const apiResponse = await createEventApi(token, request);
    return mapToEvent(apiResponse);
};
