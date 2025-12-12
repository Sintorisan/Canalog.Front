import { RouterProvider } from "@tanstack/react-router";
import { router } from "./router/routeTree";
import { Auth0ProviderWithConfig } from "./router/providers/Auth0ProviderWithConfig";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeContext, defaultTheme } from "../context/ThemeContext";
import { useUserOptionsQuery } from "../hooks/useUserOptionsQuery";

const queryClient = new QueryClient();

export function App() {
    return (
        <Auth0ProviderWithConfig>
            <QueryClientProvider client={queryClient}>
                <ThemedRouter />
            </QueryClientProvider>
        </Auth0ProviderWithConfig>
    );
}

function ThemedRouter() {
    const { data: userOptions } = useUserOptionsQuery();

    return (
        <ThemeContext.Provider value={userOptions?.theme ?? defaultTheme}>
            <RouterProvider router={router} />
        </ThemeContext.Provider>
    );
}
