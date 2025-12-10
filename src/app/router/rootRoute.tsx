import { createRootRoute, Outlet } from "@tanstack/react-router";
import Navbar from "../../components/layout/Navbar";

export const rootRoute = createRootRoute({
    component: () => (
        <>
            <Navbar />
            <main style={{ padding: "1rem" }}>
                <Outlet />
            </main>
        </>
    ),
});
