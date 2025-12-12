import { createRouter } from "@tanstack/react-router";

import { rootRoute } from "./rootRoute";
import { loginRoute } from "./login.route";
import { todayRoute as dayRoute } from "./dayEvents.route";
import { weekRoute } from "./weekEvents.route";

// Attach all routes under the ONE root
rootRoute.addChildren([loginRoute, dayRoute, weekRoute]);

// Create the router
export const router = createRouter({
    routeTree: rootRoute,
});
