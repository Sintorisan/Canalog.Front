import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuthenticatedUser } from "../hooks/useAuthenticatedUser";

export const LoginPage = () => {
    const { isAuthenticated, isLoading, error, loginWithRedirect } = useAuthenticatedUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            navigate({ to: "/" });
        }
    }, [isLoading, isAuthenticated, navigate]);

    if (isLoading) return <div>Loading…</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div>
            <h2>Sign in</h2>
            <button onClick={() => loginWithRedirect()}>Login</button>
        </div>
    );
};
