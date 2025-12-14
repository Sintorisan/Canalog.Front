import type {
    DayEventApiResponse,
    EventApiResponse,
    EventRequest,
    WeekEventsApiResponse,
} from "../types/EventTypes";

const baseUrl = import.meta.env.VITE_BASE_URL;

export const fetchDayEvents = async (token: string, date: string): Promise<DayEventApiResponse> => {
    const url = `${baseUrl}/events/day?date=${encodeURIComponent(date)}`;

    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        throw new Error("Failed to fetch today's events.");
    }

    const eventsResponse: DayEventApiResponse = await response.json();
    return eventsResponse;
};

export const fetchWeekEvents = async (
    isoDate: string,
    token: string
): Promise<WeekEventsApiResponse> => {
    const url = `${baseUrl}/events/week?start=${encodeURIComponent(isoDate)}`;

    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        throw new Error("Failed to fetch week events.");
    }

    const eventsResponse: WeekEventsApiResponse = await response.json();
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

export const fetchUserOptions = async (accessToken: string) => {
    const url = `${baseUrl}/users/sync`;

    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) throw new Error("Failed to load user options.");

    return response.json();
};

export interface ThemeListItem {
    id: string;
    name: string;
    background: string;
}

export const fetchThemes = async (accessToken: string): Promise<ThemeListItem[]> => {
    const url = `${baseUrl}/options/themes`;

    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) throw new Error("Failed to fetch themes.");

    return response.json();
};

export const updateTheme = async (accessToken: string, themeId: string): Promise<void> => {
    const url = `${baseUrl}/options`;

    const response = await fetch(url, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ themeId }),
    });

    if (!response.ok) throw new Error("Failed to update theme.");
};
