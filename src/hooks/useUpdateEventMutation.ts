import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthenticatedUser } from "./useAuthenticatedUser";
import { updateEvent } from "../services/eventService";
import { getMonday } from "../utils/dateUtils";
import type { CalendarEvent } from "../types/EventTypes";

export const useUpdateEventMutation = () => {
    const queryClient = useQueryClient();
    const { accessToken } = useAuthenticatedUser();

    return useMutation({
        mutationFn: async (event: CalendarEvent) => {
            return await updateEvent(event, accessToken!);
        },
        onSuccess: (_, updatedEvent) => {
            queryClient.invalidateQueries({
                queryKey: ["events", "day", updatedEvent.start.toISOString().split("T")[0]],
            });
            queryClient.invalidateQueries({
                queryKey: [
                    "events",
                    "week",
                    getMonday(updatedEvent.start).toISOString().split("T")[0],
                ],
            });
        },
    });
};
