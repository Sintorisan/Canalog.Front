import { useQuery } from "@tanstack/react-query";
import { useAuthenticatedUser } from "./useAuthenticatedUser";
import { fetchThemes } from "../services/apiService";

export const useThemesQuery = () => {
    const { accessToken, isAuthenticated, isLoading } = useAuthenticatedUser();

    return useQuery({
        queryKey: ["themes"],
        enabled: !!accessToken && isAuthenticated && !isLoading,
        queryFn: async () => {
            return fetchThemes(accessToken!);
        },
    });
};
