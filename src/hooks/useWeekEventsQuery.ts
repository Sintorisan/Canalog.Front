import { useQuery } from "@tanstack/react-query";
import { useAuthenticatedUser } from "../hooks/useAuthenticatedUser";
import { getWeekEventsFromDate } from "../services/eventService";

export const useWeekEventsQuery = (weekStart: Date) => {
    const { accessToken, isAuthenticated, isLoading } = useAuthenticatedUser();

    return useQuery({
        queryKey: ["events", "week", weekStart.toISOString().split("T")[0]],
        enabled: !!accessToken && isAuthenticated && !isLoading,
        queryFn: async () => {
            return getWeekEventsFromDate(weekStart, accessToken!);
        },
    });
};
