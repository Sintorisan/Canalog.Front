import type { DayEvents } from "../types/EventTypes";
import type { EventColor } from "../types/OptionsTypes";

export const useDayEventsQuery = (): {
    data: DayEvents;
    isLoading: boolean;
    isError: boolean;
} => {
    const mock = {
        date: new Date("2025-01-01"),
        events: [
            {
                id: "1",
                title: "Morning routine",
                start: new Date("2025-01-01T06:00:00"),
                end: new Date("2025-01-01T07:30:00"),
                color: 2 as EventColor,
            },
            {
                id: "2",
                title: "Work",
                start: new Date("2025-01-01T09:00:00"),
                end: new Date("2025-01-01T17:00:00"),
                color: 4 as EventColor,
            },
            {
                id: "3",
                title: "Evening chill",
                start: new Date("2025-01-01T19:00:00"),
                end: new Date("2025-01-01T21:00:00"),
                color: 0 as EventColor,
            },
        ],
    };

    return {
        data: mock,
        isLoading: false,
        isError: false,
    };
};
