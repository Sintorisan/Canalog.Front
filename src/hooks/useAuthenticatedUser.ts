import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";

export function useAuthenticatedUser() {
    const {
        user,
        isAuthenticated,
        isLoading,
        error,
        getAccessTokenSilently,
        loginWithRedirect,
        logout,
    } = useAuth0();

    const [accessToken, setAccessToken] = useState<string>("");

    useEffect(() => {
        if (isAuthenticated && !isLoading) {
            getAccessTokenSilently()
                .then((token) => {
                    if (token) {
                        setAccessToken(token);
                    }
                })
                .catch(console.error);
        }
    }, [isAuthenticated, isLoading, getAccessTokenSilently]);

    return {
        user,
        accessToken,
        isAuthenticated,
        isLoading,
        error,
        loginWithRedirect,
        logout,
    };
}
