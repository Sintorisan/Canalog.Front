import { mapDay, mapEvent, mapRequest, mapWeek } from "../mappers/eventMapper";
import type {
    CalendarEvent,
    DayEventApiResponse,
    DayEvents,
    EventRequest,
    WeekEvents,
    WeekEventsApiResponse,
} from "../types/EventTypes";
import { formatIsoDate } from "../utils/dateUtils";
import {
    createEventApi,
    deleteEventApi,
    fetchDayEvents,
    fetchWeekEvents,
    updateEventApi,
} from "./apiService";

export const getDayEvents = async (date: Date, token: string): Promise<DayEvents> => {
    const isoDate = formatIsoDate(date);
    const apiResponse: DayEventApiResponse = await fetchDayEvents(token, isoDate);

    return mapDay(apiResponse);
};

export const getWeekEventsFromDate = async (date: Date, token: string): Promise<WeekEvents> => {
    const isoDate = formatIsoDate(date);
    const apiResponse: WeekEventsApiResponse = await fetchWeekEvents(isoDate, token);

    return mapWeek(apiResponse);
};

export const createEvent = async (request: EventRequest, token: string): Promise<CalendarEvent> => {
    const apiResponse = await createEventApi(token, request);

    return mapEvent(apiResponse);
};

export const updateEvent = async (event: CalendarEvent, token: string): Promise<void> => {
    const request: EventRequest = mapRequest(event);

    return updateEventApi(token, request);
};

export const deleteEvent = async (id: string, token: string): Promise<void> =>
    deleteEventApi(token, id);
