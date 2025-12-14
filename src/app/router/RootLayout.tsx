import { Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import Navbar from "../../components/layout/Navbar";
import { LoadingSpinner } from "../../components/layout/LoadingSpinner";
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

    if (isLoading) return <LoadingSpinner message="Loading..." fullPage={true} />;

    if (location.pathname === "/login") {
        return <Outlet />;
    }

    return (
        <>
            <main
                style={{ width: "100%", height: "100%", overflow: "hidden", position: "relative" }}
            >
                <Outlet />
            </main>
            <Navbar />
        </>
    );
}
