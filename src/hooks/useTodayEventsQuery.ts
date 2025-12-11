import { useQuery } from "@tanstack/react-query";
import { getTodayEvents } from "../services/eventService";
import { useAuthenticatedUser } from "./useAuthenticatedUser";

export const useTodayEventsQuery = () => {
    const { accessToken, isAuthenticated, isLoading } = useAuthenticatedUser();

    return useQuery({
        queryKey: ["events", "today"],
        queryFn: () => getTodayEvents(accessToken),
        enabled: !!accessToken && isAuthenticated && !isLoading,
    });
};
