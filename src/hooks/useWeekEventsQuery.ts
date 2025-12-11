import { useQuery } from "@tanstack/react-query";
import { getEventsForDate } from "../services/eventService";
import { useAuthenticatedUser } from "./useAuthenticatedUser";

export const useWeekEventsQuery = (date: Date) => {
    const { accessToken, isAuthenticated, isLoading } = useAuthenticatedUser();

    return useQuery({
        queryKey: ["events", "week", date.toISOString()],
        queryFn: () => getEventsForDate(date, accessToken),
        enabled: !!accessToken && isAuthenticated && !isLoading,
    });
};
