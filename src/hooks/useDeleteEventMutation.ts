import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteEvent } from "../services/eventService";
import { useAuthenticatedUser } from "./useAuthenticatedUser";

export const useDeleteEventMutation = () => {
    const { accessToken } = useAuthenticatedUser();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteEvent(id, accessToken),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["events"] });
        },
    });
};
