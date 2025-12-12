import { useQuery } from "@tanstack/react-query";
import { useAuthenticatedUser } from "./useAuthenticatedUser";
import { fetchUserOptions } from "../services/apiService";

export const useUserOptionsQuery = () => {
    const { accessToken, isAuthenticated, isLoading } = useAuthenticatedUser();

    return useQuery({
        queryKey: ["user-options"],
        enabled: !!accessToken && isAuthenticated && !isLoading,
        queryFn: async () => {
            return fetchUserOptions(accessToken!);
        },
    });
};
