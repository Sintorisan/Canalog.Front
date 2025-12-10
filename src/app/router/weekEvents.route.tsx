import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./rootRoute";
import { WeekEventsPage } from "../../pages/WeekEventsPage";

export const weekRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/week",
    component: WeekEventsPage,
});
