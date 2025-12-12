import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthenticatedUser } from "./useAuthenticatedUser";
import { deleteEvent } from "../services/eventService";
import { getMonday } from "../utils/dateUtils";
import type { CalendarEvent } from "../types/EventTypes";

export const useDeleteEventMutation = () => {
    const queryClient = useQueryClient();
    const { accessToken } = useAuthenticatedUser();

    return useMutation({
        mutationFn: async (event: CalendarEvent) => {
            return await deleteEvent(event.id, accessToken!);
        },
        onSuccess: (_, deletedEvent) => {
            queryClient.invalidateQueries({
                queryKey: ["events", "day", deletedEvent.start.toISOString().split("T")[0]],
            });
            queryClient.invalidateQueries({
                queryKey: [
                    "events",
                    "week",
                    getMonday(deletedEvent.start).toISOString().split("T")[0],
                ],
            });
        },
    });
};
