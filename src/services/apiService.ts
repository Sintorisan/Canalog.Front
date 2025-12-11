import type { EventApiResponse, EventRequest } from "../types/Event";

const baseUrl = import.meta.env.VITE_BASE_URL;

export const fetchTodayEvents = async (token: string): Promise<EventApiResponse[]> => {
    const url = `${baseUrl}/events/today`;

    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        throw new Error("Failed to fetch today's events.");
    }
    const eventsResponse: EventApiResponse[] = await response.json();
    return eventsResponse;
};

export const fetchWeekEvents = async (
    isoDate: string,
    token: string
): Promise<EventApiResponse[]> => {
    const url = `${baseUrl}/events/week?start=${encodeURIComponent(isoDate)}`;

    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        throw new Error("Failed to fetch week events.");
    }

    const eventsResponse: EventApiResponse[] = await response.json();
    return eventsResponse;
};

export const createEventApi = async (
    token: string,
    request: EventRequest
): Promise<EventApiResponse> => {
    const url = `${baseUrl}/events`;

    const response = await fetch(url, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            title: request.title,
            color: request.color,
            start: request.start.toISOString(),
            end: request.end.toISOString(),
        }),
    });
    if (!response.ok) throw new Error("Failed to create event");

    const eventsResponse: EventApiResponse = await response.json();

    return eventsResponse;
};

export const updateEventApi = async (token: string, request: EventRequest): Promise<void> => {
    const url = `${baseUrl}/events`;

    const response = await fetch(url, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id: request.id,
            title: request.title,
            color: request.color,
            start: request.start.toISOString(),
            end: request.end.toISOString(),
        }),
    });

    if (!response.ok) throw new Error("Failed to update event");
};

export const deleteEventApi = async (token: string, id: string) => {
    const url = `${baseUrl}/events/${id}`;

    const response = await fetch(url, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error("Failed to delete event");
};
