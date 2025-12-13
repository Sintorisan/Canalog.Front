import { useQuery } from "@tanstack/react-query";
import { useAuthenticatedUser } from "../hooks/useAuthenticatedUser";
import { getWeekEventsFromDate } from "../services/eventService";
import { formatIsoDate } from "../utils/dateUtils";

export const useWeekEventsQuery = (weekStart: Date) => {
    const { accessToken, isAuthenticated, isLoading } = useAuthenticatedUser();

    return useQuery({
        queryKey: ["events", "week", formatIsoDate(weekStart)],
        enabled: !!accessToken && isAuthenticated && !isLoading,
        queryFn: async () => {
            return getWeekEventsFromDate(weekStart, accessToken!);
        },
    });
};
