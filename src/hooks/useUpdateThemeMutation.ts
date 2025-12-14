import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthenticatedUser } from "./useAuthenticatedUser";
import { updateTheme } from "../services/apiService";

export const useUpdateThemeMutation = () => {
    const queryClient = useQueryClient();
    const { accessToken } = useAuthenticatedUser();

    return useMutation({
        mutationFn: async (themeId: string) => {
            return await updateTheme(accessToken!, themeId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["user-options"],
            });
        },
    });
};
