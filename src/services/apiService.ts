import type { EventApiResponse } from "../types/event";

const baseUrl = import.meta.env.VITE_BASE_URL;

export const fetchTodayEvents = async (): Promise<EventApiResponse[]> => {
    const response = await fetch(baseUrl);
    if (!response.ok) {
        throw new Error("Failed to fetch events.");
    }

    const eventsResponse: EventApiResponse[] = await response.json();
    return eventsResponse;
};

export const fetchWeekEvents = async (isoDate: string): Promise<EventApiResponse[]> => {
    const url = `${baseUrl}/events?date=${encodeURIComponent(isoDate)}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error("Failed to fetch events.");
    }

    const eventsResponse: EventApiResponse[] = await response.json();
    return eventsResponse;
};
