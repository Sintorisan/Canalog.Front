import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthenticatedUser } from "./useAuthenticatedUser";
import { createEvent } from "../services/eventService";
import { getMonday } from "../utils/dateUtils";
import type { EventRequest } from "../types/EventTypes";

export const useCreateEventMutation = () => {
    const queryClient = useQueryClient();
    const { accessToken } = useAuthenticatedUser();

    return useMutation({
        mutationFn: async (request: EventRequest) => {
            return await createEvent(request, accessToken!);
        },
        onSuccess: (createdEvent) => {
            queryClient.invalidateQueries({
                queryKey: ["events", "day", createdEvent.start.toISOString().split("T")[0]],
            });
            queryClient.invalidateQueries({
                queryKey: [
                    "events",
                    "week",
                    getMonday(createdEvent.start).toISOString().split("T")[0],
                ],
            });
        },
    });
};
