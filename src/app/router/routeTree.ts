import { createRouter } from "@tanstack/react-router";

import { rootRoute } from "./rootRoute";
import { loginRoute } from "./login.route";
import { todayRoute } from "./todayEvents.route";
import { weekRoute } from "./weekEvents.route";

// Attach all routes under the ONE root
rootRoute.addChildren([loginRoute, todayRoute, weekRoute]);

// Create the router
export const router = createRouter({
    routeTree: rootRoute,
});
