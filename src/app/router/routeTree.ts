import { createRouter } from "@tanstack/react-router";

import { rootRoute } from "./rootRoute";
import { loginRoute } from "./login.route";
import { todayRoute as dayRoute } from "./dayEvents.route";
import { dateRoute } from "./date.route";
import { weekRoute } from "./weekEvents.route";
import { optionsRoute } from "./options.route";

// Attach all routes under the ONE root
rootRoute.addChildren([loginRoute, dayRoute, weekRoute, dateRoute, optionsRoute]);

// Create the router
export const router = createRouter({
    routeTree: rootRoute,
});
