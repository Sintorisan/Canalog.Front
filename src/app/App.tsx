import { RouterProvider } from "@tanstack/react-router";
import { router } from "./router/routeTree";
import { Auth0ProviderWithConfig } from "./router/providers/Auth0ProviderWithConfig";

export function App() {
    return (
        <Auth0ProviderWithConfig>
            <RouterProvider router={router} />
        </Auth0ProviderWithConfig>
    );
}
