import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateEvent } from "../services/eventService";
import { useAuthenticatedUser } from "./useAuthenticatedUser";
import type { CalendarEvent } from "../types/Event";

export const useUpdateEventMutation = () => {
    const { accessToken } = useAuthenticatedUser();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (request: CalendarEvent) => updateEvent(request, accessToken),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["events"] });
        },
    });
};
