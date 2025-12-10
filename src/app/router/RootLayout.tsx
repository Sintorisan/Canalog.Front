import { Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import Navbar from "../../components/layout/Navbar";
import { useAuthenticatedUser } from "../../hooks/useAuthenticatedUser";
import { useEffect } from "react";

export function RootLayout() {
    const { isAuthenticated, isLoading } = useAuthenticatedUser();
    const navigate = useNavigate();
    const { location } = useRouterState();

    useEffect(() => {
        if (!isLoading && !isAuthenticated && location.pathname !== "/login") {
            navigate({ to: "/login" });
        }
    }, [isLoading, isAuthenticated, location.pathname, navigate]);

    useEffect(() => {
        if (!isLoading && isAuthenticated && location.pathname === "/login") {
            navigate({ to: "/" });
        }
    }, [isLoading, isAuthenticated, location.pathname, navigate]);

    if (isLoading) return <div>Loading...</div>;

    if (location.pathname === "/login") {
        return <Outlet />;
    }

    return (
        <>
            <Navbar />
            <main style={{ padding: "1rem" }}>
                <Outlet />
            </main>
        </>
    );
}
