import { useQuery } from "@tanstack/react-query";
import { useAuthenticatedUser } from "./useAuthenticatedUser";
import { getDayEvents } from "../services/eventService";

export const useDayEventsQuery = (date: Date) => {
    const { accessToken, isAuthenticated, isLoading } = useAuthenticatedUser();

    return useQuery({
        queryKey: ["events", "day", date.toISOString().split("T")[0]],
        enabled: !!accessToken && isAuthenticated && !isLoading,
        queryFn: async () => {
            return getDayEvents(date, accessToken!);
        },
    });
};
