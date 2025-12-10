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
