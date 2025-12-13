import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthenticatedUser } from "./useAuthenticatedUser";
import { createEvent } from "../services/eventService";
import { getMonday, formatIsoDate } from "../utils/dateUtils";
import type { EventRequest } from "../types/EventTypes";

export const useCreateEventMutation = () => {
    const queryClient = useQueryClient();
    const { accessToken } = useAuthenticatedUser();

    return useMutation({
        mutationFn: async (request: EventRequest) => {
            return await createEvent(request, accessToken!);
        },
        onSuccess: (createdEvent) => {
            console.debug("useCreateEventMutation.onSuccess", createdEvent.id);
            queryClient.invalidateQueries({
                queryKey: ["events", "day", formatIsoDate(createdEvent.start)],
            });
            queryClient.invalidateQueries({
                queryKey: ["events", "week", formatIsoDate(getMonday(createdEvent.start))],
            });
        },
    });
};
