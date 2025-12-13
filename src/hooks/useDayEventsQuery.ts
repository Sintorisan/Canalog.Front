import { useQuery } from "@tanstack/react-query";
import { useAuthenticatedUser } from "./useAuthenticatedUser";
import { getDayEvents } from "../services/eventService";
import { formatIsoDate } from "../utils/dateUtils";

export const useDayEventsQuery = (date: Date) => {
    const { accessToken, isAuthenticated, isLoading } = useAuthenticatedUser();

    return useQuery({
        queryKey: ["events", "day", formatIsoDate(date)],
        enabled: !!accessToken && isAuthenticated && !isLoading,
        queryFn: async () => {
            return getDayEvents(date, accessToken!);
        },
    });
};
