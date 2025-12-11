import type { CalendarEvent, EventApiResponse, EventRequest } from "../types/Event";
import { createEventApi, fetchTodayEvents, fetchWeekEvents, updateEventApi } from "./apiService";

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

export const updateEvent = async (event: CalendarEvent, token: string): Promise<void> => {
    const request: EventRequest = {
        id: event.id,
        title: event.title,
        start: event.start,
        end: event.end,
        eventColor: event.eventColor,
    };

    return updateEventApi(token, request);
};
