import { Auth0Provider } from "@auth0/auth0-react";
import type { PropsWithChildren } from "react";

type Auth0ProviderWithConfigProps = PropsWithChildren;
type Auth0AppState = {
    returnTo?: string;
};

export function Auth0ProviderWithConfig({ children }: Auth0ProviderWithConfigProps) {
    const domain = import.meta.env.VITE_AUTH0_DOMAIN;
    const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
    const audience = import.meta.env.VITE_AUTH0_AUDIENCE;

    const onRedirectCallback = (appState: Auth0AppState | undefined) => {
        const returnTo = appState?.returnTo || window.location.pathname;
        window.history.replaceState({}, "", returnTo);
    };

    return (
        <Auth0Provider
            domain={domain}
            clientId={clientId}
            authorizationParams={{
                redirect_uri: window.location.origin,
                audience,
            }}
            onRedirectCallback={onRedirectCallback}
        >
            {children}
        </Auth0Provider>
    );
}
