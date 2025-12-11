import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEvent } from "../services/eventService";
import { useAuthenticatedUser } from "./useAuthenticatedUser";
import type { CalendarEvent } from "../types/Event";

export const useCreateEventMutation = () => {
    const { accessToken } = useAuthenticatedUser();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (request: CalendarEvent) => createEvent(request, accessToken),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["events"] });
        },
    });
};
