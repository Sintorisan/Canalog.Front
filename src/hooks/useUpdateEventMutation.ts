import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthenticatedUser } from "./useAuthenticatedUser";
import { updateEvent } from "../services/eventService";
import { getMonday, formatIsoDate } from "../utils/dateUtils";
import type { CalendarEvent } from "../types/EventTypes";

export const useUpdateEventMutation = () => {
    const queryClient = useQueryClient();
    const { accessToken } = useAuthenticatedUser();

    return useMutation({
        mutationFn: async (event: CalendarEvent) => {
            return await updateEvent(event, accessToken!);
        },
        onSuccess: (_, updatedEvent) => {
            console.debug("useUpdateEventMutation.onSuccess", updatedEvent.id);
            queryClient.invalidateQueries({
                queryKey: ["events", "day", formatIsoDate(updatedEvent.start)],
            });
            queryClient.invalidateQueries({
                queryKey: ["events", "week", formatIsoDate(getMonday(updatedEvent.start))],
            });
        },
    });
};
