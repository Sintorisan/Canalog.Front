import { RouterProvider } from "@tanstack/react-router";
import { router } from "./router/routeTree";
import { Auth0ProviderWithConfig } from "./router/providers/Auth0ProviderWithConfig";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export function App() {
    return (
        <Auth0ProviderWithConfig>
            <QueryClientProvider client={queryClient}>
                <RouterProvider router={router} />
            </QueryClientProvider>
        </Auth0ProviderWithConfig>
    );
}
