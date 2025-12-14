import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { useAuthenticatedUser } from "./useAuthenticatedUser";
import { getDayEvents } from "../services/eventService";
import { formatIsoDate } from "../utils/dateUtils";
import type { DayEvents } from "../types/EventTypes";

export const useDayEventsQuery = (
    date: Date,
    options?: Omit<UseQueryOptions<DayEvents, Error>, "queryKey" | "queryFn">
) => {
    const { accessToken, isAuthenticated, isLoading } = useAuthenticatedUser();

    return useQuery({
        queryKey: ["events", "day", formatIsoDate(date)],
        enabled: options?.enabled !== false && !!accessToken && isAuthenticated && !isLoading,
        queryFn: async () => {
            return getDayEvents(date, accessToken!);
        },
        ...options,
    });
};
