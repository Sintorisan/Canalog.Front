import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./rootRoute";
import { DayEventsPage } from "../../pages/DayEventsPage";

export const todayRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    component: DayEventsPage,
});
